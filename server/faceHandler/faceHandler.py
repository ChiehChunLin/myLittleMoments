import sys
import os
import cv2
import math
import config
import numpy as np
import sklearn
from PIL import ImageFont, ImageDraw, Image
from utils import face_preprocess
from utils.utils import feature_compare, load_mtcnn, load_faces, load_mobilefacenet, add_faces

# 人臉辨識閥值
VERIFICATION_THRESHOLD = config.VERIFICATION_THRESHOLD

# mtcnn人臉檢測模型
mtcnn_detector = load_mtcnn()
# mobilefacenet人臉檢測模型
face_sess, inputs_placeholder, embeddings = load_mobilefacenet()
# 偵測人臉位置
add_faces(mtcnn_detector)
# 讀取已訓練的人臉庫
faces_db = load_faces(face_sess, inputs_placeholder, embeddings)


# 註冊人臉
def face_register(img_path):
    angles = [0, 90, 180, 270]
    filename = os.path.splitext(os.path.basename(img_path))[0]
    image = cv2.imdecode(np.fromfile(img_path, dtype=np.uint8), 1)
    
    for angle in angles:
        rotated_image = rotate_image(image, angle)
        faces, landmarks = mtcnn_detector.detect(rotated_image)
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
                nimg = face_preprocess.preprocess(rotated_image, bbox, points, image_size='112,112')
                cv2.imencode('.png', nimg)[1].tofile('../faceTrained/%s.png' % filename)
                print("{} Success".format(filename))
                return

    print('{} Fail'.format(filename))

# 人臉識別
def face_recognition(img_path):
    image = cv2.imdecode(np.fromfile(img_path, dtype=np.uint8), 1)
    faces, landmarks = mtcnn_detector.detect(image)

    if faces.shape[0] != 0:
        faces_sum = 0
        for i, face in enumerate(faces):
            if round(faces[i, 4], 6) > 0.95:
                faces_sum += 1
        if faces_sum > 0:
            # 人臉訊息
            info_location = np.zeros(faces_sum)
            info_location[0] = 1
            info_name = []
            probs = []
            # 提取照片中的人臉
            input_images = np.zeros((faces.shape[0], 112, 112, 3))
            for i, face in enumerate(faces):
                if round(faces[i, 4], 6) > 0.95:
                    bbox = faces[i, 0:4]
                    points = landmarks[i, :].reshape((5, 2))
                    nimg = face_preprocess.preprocess(image, bbox, points, image_size='112,112')
                    nimg = nimg - 127.5
                    nimg = nimg * 0.0078125
                    input_images[i, :] = nimg

            # 進行人臉識別
            feed_dict = {inputs_placeholder: input_images}
            emb_arrays = face_sess.run(embeddings, feed_dict=feed_dict)
            # print(emb_arrays.shape)
            emb_arrays = sklearn.preprocessing.normalize(emb_arrays)
            # print(emb_arrays.shape)
            for i, embedding in enumerate(emb_arrays):
                embedding = embedding.flatten()
                temp_dict = {}
                # 比較已存在的人臉資料庫
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

# 照片依人臉轉正
def rotate_image(img, angle):
    h, w = img.shape[:2]
    M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1)
    rotated = cv2.warpAffine(img, M, (w, h))
    return rotated

def process_image_rotations(image_path, output_base_path):
    # 讀取圖像
    img = cv2.imread(image_path)
    angles = [0, 90, 180, 270]
    
    for angle in angles:
        rotated_image = rotate_image(img, angle)
        faces, landmarks = mtcnn_detector.detect(rotated_image)
        if faces.shape[0] != 0:
            output_path = f"{output_base_path}_{angle}.jpg"
            cv2.imwrite(output_path, rotated_image)
            print(f"檢測到人臉和眼睛的照面已保存至: {output_path}")
        else:
            print(f"在旋轉角度 {angle} 時為檢測到人臉或眼睛。")

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
        print("功能選擇錯誤")
        
    
