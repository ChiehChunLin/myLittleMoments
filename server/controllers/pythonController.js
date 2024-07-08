const { spawn } = require('child_process');
const scriptPath = "faceHandler/faceHandler.py";

function faceControl(caseCode, imagePaths, callback) {

    function constructPython(caseCode, imagePaths){
        return [scriptPath, caseCode, imagePaths];
    }
    const constructs = constructPython(caseCode, imagePaths);
    const pythonProcess = spawn(process.env.PYTHON3_PATH, constructs);
    // const pythonProcess = spawn('python3', constructs);

    let resultStr = '';
    let error = '';

    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
        // console.log("stdout")
        // console.log(data.toString())
        resultStr += data.toString();
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
            callback(null, resultStr);
        }
    });
}


module.exports = faceControl;