let model; // TensorFlow.js model
let audioFile; // To store uploaded audio
let result = ""; // Analysis result

function preload() {
  // Load TensorFlow.js model
  const modelURL = "https://raw.githubusercontent.com/yourusername/neonatal-cry-model/main/model.json"; // Replace with your hosted model URL
  tf.loadGraphModel(modelURL).then((loadedModel) => {
    model = loadedModel;
    console.log("Model loaded successfully!");
  });
}

function setup() {
  createCanvas(400, 300);
  background(240);

  // File input button
  const fileInput = createFileInput(handleFile);
  fileInput.position(10, 10);

  // Analyze button
  const analyzeButton = createButton("Analyze Cry");
  analyzeButton.position(10, 50);
  analyzeButton.mousePressed(analyzeCry);

  // Display result
  textSize(16);
  textAlign(LEFT, TOP);
}

function draw() {
  background(240);
  text("Upload an audio file and click 'Analyze Cry' to assess the baby's cry.", 10, 80, 380, 200);
  text(`Result: ${result}`, 10, 200, 380, 100);
}

function handleFile(file) {
  if (file.type === "audio") {
    audioFile = file.file; // Save the uploaded file
    console.log("Audio file uploaded.");
  } else {
    alert("Please upload an audio file.");
  }
}

async function analyzeCry() {
  if (!audioFile) {
    alert("No audio file uploaded!");
    return;
  }

  if (!model) {
    alert("Model not loaded yet!");
    return;
  }

  // Decode audio and preprocess for TensorFlow.js
  const audioContext = new AudioContext();
  const arrayBuffer = await audioFile.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const audioData = audioBuffer.getChannelData(0); // Single channel audio
  const inputTensor = tf.tensor(audioData.slice(0, 16000), [1, 16000]); // 1-second audio tensor

  // Predict the class
  const predictions = await model.predict(inputTensor);
  const predictedClassIndex = predictions.argMax(1).dataSync()[0];
  const classes = ["Hungry Cry", "Pain Cry", "Happy Cry"]; // Replace with your model's classes

  // Update result
  result = `Cry Type: ${classes[predictedClassIndex]}`;
}
