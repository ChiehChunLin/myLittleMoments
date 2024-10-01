require("dotenv").config();
const { 
    SendMessageCommand, 
    ReceiveMessageCommand, 
    DeleteMessageCommand, 
    SQSClient 
} = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ 
    region: process.env.AWS_SQS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SQS_ACCESS_SECRET_KEY
    }
});
const QUEUE_URL = process.env.AWS_SQS_URL;

const sendMessage = async (messageBody) => {
    try {
        const command = new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: messageBody,
        });
        const response = await sqsClient.send(command);
        console.log("SQS Message sent:", response.MessageId);
    } catch (error) {
        console.error("SQS Error sending message:", error);
    }
};

const receiveMessages = async () => {
    try {
        const command = new ReceiveMessageCommand({
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 1, // 設定接收的最大訊息數量
            VisibilityTimeout: 20, // 設定訊息的可見性超時（秒）
            WaitTimeSeconds: 10, // 長輪詢等待時間（秒）
        });
        const response = await sqsClient.send(command);
        if (response.Messages && response.Messages.length > 0) {
            const message = response.Messages[0];
            console.log("SQS Message received:", message.Body);
            return message;
        } else {
            console.log("No messages received.");
            return null;
        }
    } catch (error) {
        console.error("SQS Error receiving messages:", error);
    }
};

const deleteMessage = async (receiptHandle) => {
    try {
        const command = new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: receiptHandle,
        });
        await sqsClient.send(command);
        console.log("SQS Message deleted.");
    } catch (error) {
        console.error("SQS Error deleting message:", error);
    }
};


const main = async () => {
    // 發送一條訊息
    await sendMessage("Hello, SQS!");

    // 接收訊息
    const message = await receiveMessages();
    if (message) {
        // 刪除接收到的訊息
        await deleteMessage(message.ReceiptHandle);
    }
};

main();