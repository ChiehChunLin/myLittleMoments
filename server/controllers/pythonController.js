const { spawn } = require('child_process');
const scriptPath = "faceHandler/faceHandler.py";

function faceControl(caseCode, imagePaths, callback) {

    function constructPython(caseCode, imagePaths){
        return [scriptPath, caseCode, imagePaths];
    }
    const constructs = constructPython(caseCode, imagePaths);
    const pythonProcess = spawn('/home/chiehchunlin/wk/00-Web/Tensorflow-FaceRecognition/myenv/bin/python3', constructs);
    // const pythonProcess = spawn('python3', constructs);

    let result = '';
    let error = '';

    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
        // console.log("stdout")
        // console.log(data.toString())
        // result += data.toString();
    });

    // Handle any errors
    pythonProcess.stderr.on('data', (data) => {
        // console.log("stderr")
        // console.log(data.toString())
        // error += data.toString();
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