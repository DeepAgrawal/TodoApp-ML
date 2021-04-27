import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
const aidTodos = require('./data/aid_todos.json')
const bookTodos = require('./data/book_todos.json')
const cakeTodos = require('./data/cake_todos.json')
const sportTodos = require('./data/sport_todos.json')
const travelTodos = require('./data/travel_todos.json')

const trainTasks = aidTodos
  .concat(bookTodos)
  .concat(cakeTodos)
  .concat(sportTodos)
  .concat(travelTodos)

const MODEL_NAME = 'final-model'
const N_CLASSES = 5

const encodeData = async (encoder, tasks) => {
  const sentences = tasks.map((t) => t.text.toLowerCase())
  const embeddings = await encoder.embed(sentences)
  return embeddings
}

const trainModel = async (encoder, container) => {
  try {
    const loadedModel = await tf.loadLayersModel(`localstorage://${MODEL_NAME}`)
    console.log('Using existing model')
    return loadedModel
  } catch (e) {
    console.log('Training new model')
  }

  const xTrain = await encodeData(encoder, trainTasks) // text embeddings

  const yTrain = tf.tensor2d(
    trainTasks.map((t) => [
      t.icon === 'AID' ? 1 : 0,
      t.icon === 'BOOK' ? 1 : 0,
      t.icon === 'CAKE' ? 1 : 0,
      t.icon === 'SPORT' ? 1 : 0,
      t.icon === 'TRAVEL' ? 1 : 0
    ])
  )

  const model = tf.sequential()

  // // hidden layers
  // model.add(
  //   tf.layers.dense({
  //     inputShape: [xTrain.shape[1]],
  //     activation: 'sigmoid',
  //     units: 50
  //   })
  // )

  // model.add(
  //   tf.layers.dense({
  //     inputShape: [50],
  //     activation: 'sigmoid',
  //     units: 15
  //   })
  // )

  // model.add(
  //   tf.layers.dense({
  //     inputShape: [15],
  //     activation: 'sigmoid',
  //     units: 8
  //   })
  // )

  // output layer
  model.add(
    tf.layers.dense({
      inputShape: [512],
      activation: 'softmax',
      units: N_CLASSES
    })
  )

  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.adam(0.001),
    metrics: ['accuracy']
  })

  await model.fit(xTrain, yTrain, {
    validationSplit: 0.1,
    shuffle: true,
    epochs: 150,
    callbacks: tfvis.show.fitCallbacks(
      container,
      ['loss', 'val_loss', 'acc', 'val_acc'],
      {
        callbacks: ['onEpochEnd']
      }
    )
  })

  await model.save(`localstorage://${MODEL_NAME}`)
  return model
}

const suggestIcon = async (model, encoder, taskName, threshold) => {
  if (taskName.trim() === '') {
    return null
  }
  const xPredict = await encodeData(encoder, [{ text: taskName }])
  const prediction = model.predict(xPredict).dataSync()

  console.log(prediction)

  if (prediction[0] > threshold) {
    return 'AID'
  } else if (prediction[1] > threshold) {
    return 'BOOK'
  } else if (prediction[2] > threshold) {
    return 'CAKE'
  } else if (prediction[3] > threshold) {
    return 'SPORT'
  } else if (prediction[4] > threshold) {
    return 'TRAVEL'
  } else {
    return 'TODO'
  }
}

export { suggestIcon, trainModel }
