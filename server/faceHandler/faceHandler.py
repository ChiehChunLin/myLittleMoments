import sys
import os
import cv2
import config
import numpy as np
import sklearn
from PIL import ImageFont, ImageDraw, Image
from utils import face_preprocess
from utils.utils import feature_compare, load_mtcnn, load_faces, load_mobilefacenet, add_faces

# 人脸识别阈值
VERIFICATION_THRESHOLD = config.VERIFICATION_THRESHOLD

# 检测人脸检测模型
mtcnn_detector = load_mtcnn()
# 加载人脸识别模型
face_sess, inputs_placeholder, embeddings = load_mobilefacenet()
# 添加人脸
add_faces(mtcnn_detector)
# 加载已经注册的人脸
faces_db = load_faces(face_sess, inputs_placeholder, embeddings)


# 注册人脸
def face_register(img_path):
    image = cv2.imdecode(np.fromfile(img_path, dtype=np.uint8), 1)
    faces, landmarks = mtcnn_detector.detect(image)
    if faces.shape[0] != 0:
        faces_sum = 0
        bbox = []
        points = []
        for i, face in enumerate(faces):
            if round(faces[i, 4], 6) > 0.95:
                bbox = faces[i, 0:4]
                points = landmarks[i, :].reshape((5, 2))
                faces_sum += 1
        if faces_sum == 1:
            filename = os.path.splitext(os.path.basename(img_path))[0]
            nimg = face_preprocess.preprocess(image, bbox, points, image_size='112,112')
            cv2.imencode('.png', nimg)[1].tofile('faceTrained/%s.png' % filename)
            print("{} Success".format(filename))
        else:
            print('{} Fail'.format(filename))
    else:
        print('{} Fail'.format(filename))


def face_recognition(img_path):
    image = cv2.imdecode(np.fromfile(img_path, dtype=np.uint8), 1)
    faces, landmarks = mtcnn_detector.detect(image)

    if faces.shape[0] != 0:
        faces_sum = 0
        for i, face in enumerate(faces):
            if round(faces[i, 4], 6) > 0.95:
                faces_sum += 1
        if faces_sum > 0:
            # 人脸信息
            info_location = np.zeros(faces_sum)
            info_location[0] = 1
            info_name = []
            probs = []
            # 提取图像中的人脸
            input_images = np.zeros((faces.shape[0], 112, 112, 3))
            for i, face in enumerate(faces):
                if round(faces[i, 4], 6) > 0.95:
                    bbox = faces[i, 0:4]
                    points = landmarks[i, :].reshape((5, 2))
                    nimg = face_preprocess.preprocess(image, bbox, points, image_size='112,112')
                    nimg = nimg - 127.5
                    nimg = nimg * 0.0078125
                    input_images[i, :] = nimg

            # 进行人脸识别
            feed_dict = {inputs_placeholder: input_images}
            emb_arrays = face_sess.run(embeddings, feed_dict=feed_dict)
            # print(emb_arrays.shape)
            emb_arrays = sklearn.preprocessing.normalize(emb_arrays)
            # print(emb_arrays.shape)
            for i, embedding in enumerate(emb_arrays):
                embedding = embedding.flatten()
                temp_dict = {}
                # 比较已经存在的人脸数据库
                for com_face in faces_db:
                    ret, sim = feature_compare(embedding, com_face["feature"], 0.70)
                    temp_dict[com_face["name"]] = sim
                dict = sorted(temp_dict.items(), key=lambda d: d[1], reverse=True)
                if dict[0][1] > VERIFICATION_THRESHOLD:
                    name = dict[0][0]
                    probs.append(dict[0][1])
                    info_name.append(name)
                else:
                    probs.append(dict[0][1])
                    info_name.append("unknown")

            for k in range(faces_sum):
                print(f"{info_name[k]} {'%.2f' % probs[k]}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: script.py <arg1> <arg2>")
        sys.exit(1)
    
    # Get the arguments
    case = sys.argv[1]
    paths = sys.argv[2:][0].split(',')
    # print("python paths: {}".format(paths))

    if case == '1':                
        # print('case 1')
        for path in paths:
            result = face_register(path)

    elif case == '2':
        # print('case 2')
        result = face_recognition(paths[0])

    else:
        print("功能选择错误")

    # i = int(input("请选择功能，1为注册人脸，2为识别人脸："))
    # image_path = input("请输入图片路径：")
    # if i == 1:
    #     user_name = input("请输入注册名：")
    #     face_register(image_path)
    # elif i == 2:
    #     face_recognition(image_path)
    # else:
    #     print("功能选择错误")
        
    
