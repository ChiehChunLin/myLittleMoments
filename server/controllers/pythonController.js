const { spawn } = require('child_process');
const scriptPath = "faceHandler/faceHandler.py";

function faceControl(caseCode, imageFiles, callback) {
    
    function constructPython(caseCode, imageFiles){
        return [scriptPath, caseCode, imageFiles];
        //return ['-l', '-c', '/home/chiehchunlin/wk/00-Web/Tensorflow-FaceRecognition/myenv/bin/python3', scriptPath, caseCode, imageFiles];
        //return ['-l', '-c', 'ls -al']
    }
    const constructs = constructPython(caseCode, imageFiles);
    console.log(constructs);
    const pythonProcess = spawn('/home/chiehchunlin/wk/00-Web/Tensorflow-FaceRecognition/myenv/bin/python3', constructs);
    console.log('spawn done');
    let result = '';
    let error = '';

    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString())

        result += data.toString();
    });

    // Handle any errors
    pythonProcess.stderr.on('data', (data) => {
        console.log(data.toString())
        error += data.toString();
    });

    // When the process is done
    pythonProcess.on('close', (code) => {
        console.log("close")
        if (code !== 0) {
            callback(new Error(`Python script exited with code ${code}\n${error}`), null);
        } else {
            callback(null, result);
        }
    });
    console.log('nothing happen');
}


module.exports = faceControl;