const { spawn } = require('child_process');
const scriptPath = "../faceHandler/faceHandler.py";

function faceControl(caseCode, imageFiles, cb) {
    
    function constructPython(caseCode, imageFiles){
        return [scriptPath, caseCode, imageFiles];
    }
    const constructs = constructPython(caseCode, imageFiles);
    const pythonProcess = spawn('python', constructs);

    let result = '';
    let error = '';

    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    // Handle any errors
    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    // When the process is done
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            callback(new Error(`Python script exited with code ${code}\n${error}`), null);
        } else {
            callback(null, result);
        }
    });
}


module.exports = faceControl;