# Introduction
[myMoments](https://github.com/ChiehChunLin/myMoments) is a product designed for families with children. It integrates line message api (a service bot with LINE [myLineBot](https://github.com/ChiehChunLin/myLineBot)) to help families record their child's daily activities, including time tracks, daily logs, and routine records. Families can browse photos, videos, and important moments of their child's growth, which are sure to bring smiles. Additionally, the routine data can be exported into charts for caregivers to view conveniently. Advanced features will integrate an AI facial recognition model to automatically detect and collect photos of the child uploaded by family and friends in communication groups into a baby album, saving parents the time of organizing photos.

## Main Service
* LINE Login for fully authorization service
* LINE Bot for uploading images, videos, and text commands
* Read images and videos from AWS S3 and display as timeline wall
* Read data from AWS RDS and display as posts or charts(D3)
* Face recognition with Tensorflow to auto grab images from LINE group

## Views
![myMoments_interface](https://github.com/user-attachments/assets/4adbb8a5-ea40-4aa3-9541-8b0fd33d4f57)


# Technics

## Front-End
| Front-End           | Items                          |  Details |
| :------------------ | :----------------------------- | :------- |
| VanillaJS           | HTML<br>CSS<br>JavaScript      | Developed basic views and interactive elements for the website. |
| Framework           | Bootstrap 4.5                  | Utilized existing components to meet project requirements. |
| Chart               | d3.js v7                       | Visualized data using histograms and line plots. |

## Back-End
| Back-End             | Items                                            | Details  |
| :------------------- | :----------------------------------------------- | :--------------- |
| Stateless Structure  | AWS EC2<br>AWS RDS<br>AWS S3 + CDN               | Deployed a stateless system on AWS Cloud for scalability. <br>Used MySQL to structure the relationships between babies and family members.<br>Managed images and videos in S3 and used a CDN to display them efficiently.|
| Severless Structure  | API Gateway<br>SQS<br>Lambda                     | I set up AWS API Gateway and Lambda to handle LINE Bot events and ensure 24-hour support for users in a cost-effective manner. To avoid message loss in the LINE group, I used two SQS queues to manage normal and failed messages in a cycle, ensuring all messages are processed properly. |
| LINE Developers      | LINE Login<br>LINE Messaging API                 | LINE is a widely used communication software. The integration of LINE services to connect the entire suite of product services and reduces user barriers.
| Face Recognition     | Tensorflow on CPU<br>OpenCV                      | To balance accuracy and resource efficiency, I used a pre-trained TensorFlow model to train on faces and compare image scores for face recognition. |
| Face Handler Consumer  | Redis Queue                                      | As the number of people in the pictures increases, face recognition takes more time. Implementing Redis queue consumer solutions can prevent processing bottlenecks and ensure scalability when necessary. |


# Architecture
![myMoments_architecture](https://github.com/user-attachments/assets/7e7e1300-1857-46fd-8596-b75c597d2715)

## Structure
```
├── client
│ ├── images
│ ├── js
│ ├── styles
│ ├── views
├── server
│ ├── controllers
│ ├── database
│ ├── faceHandler   (Python for Face)
│ ├── faceTrained
│ ├── middlewares
│ ├── queue
│ ├    ├── index.js (worker)
│ ├── routes
│ ├── utils
│ ├── app.js    (web server)
│ ├── createSqlTables.js
│ ├── myBaby.sql
│ ├── package.json
│ ├── package-lock.json
│ ├── README.md
└── 
```

# Spike Testing (K6)

## K6 Scenario
* executor : constant-arrival-rate
* timeUnit : 1s
* duration : 20s

| rate | preAllocatedVUs | maxVUs | checks | http_req_duration(med) | iterations  |
| :--: | :-------------: | :----: | :----: | :--------------------: | :---------: |
| 100  | 500             | 1000   | 100% (1925)  | 150.52 ms        |  91.041315/s|
| 200  | 500             | 1000   | 100% (4001)  | 150.76 ms        | 189.162314/s|
| 250  | 500             | 1000   | 100% (5001)  | 151.35 ms        | 236.397171/s|
| 255  | 500             | 1000   | 99.4% (5044) | 151.62 ms        | 239.885577/s|
| 250  | 600             | 1000   | 98.2% (4910) | 151.96 ms        | 236.40128/s |
| 250  | 550             | 1000   | 98.79% (4937) | 152.38 ms       | 236.242439/s|

**`htop` shows the CPU limit, when k6 rate > 250 and preAllocatedVUs > 500**

# Reference
* [LINE Developers](https://developers.line.biz/en/docs/messaging-api/overview/#send-different-message-types)
* [LINE Github](https://github.com/line/line-bot-sdk-nodejs/blob/master/examples/echo-bot/index.js)
* [Tensorflow-FaceRecogniton](https://github.com/ChiehChunLin/Tensorflow-FaceRecognition/blob/master/README.md)
* [Tflite-Face-Detection](https://pypi.org/project/face-detection-tflite/)
* [APIGateway-SQS-Lambda](https://www.youtube.com/watch?v=AII6RRVq4Uo)
* [APIGateway-to-RESTAPI](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/integrate-amazon-api-gateway-with-amazon-sqs-to-handle-asynchronous-rest-apis.html)


