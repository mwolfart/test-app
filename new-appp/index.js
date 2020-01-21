
// window.onload = async function () {
// }
var data = [];
var limit = 20;
let sdk;
window.onload = () => {
  sdk = initVguiSDK();
  createPlot();
  startVue();
}

function initVguiSDK() {
  const vguiSDK = new VguiSDK('com.sap.demo.scenes.slider');
  vguiSDK.addListener((data) => {
    const content = JSON.parse(data.content);
    updatePlot(content[0].value.values[0].y)
  });
  return vguiSDK;
}

function startVue() {
  new Vue({
    el: '#main',
    data: {
      freq: 50,
      amp: 50
    },
    methods: {
      fchange: function () {
        sdk.sendData('sceneconnectorbeta1', 'frequency', +this.freq)
      },
      achange: function () {
        sdk.sendData('sceneconnectorbeta1', 'amplitude', +this.amp)
      }
    }
  });
}

function createPlot() {
  Plotly.plot('plot', [{
    y: data,
    mode: 'lines',
    line: { color: '#80CAF6' }
  }]);
}

function updatePlot(value) {
  data.push(value);
  if (data.length > limit) {
    data.shift();
  }
  Plotly.update('plot', { y: [data] });
}

function rand() {
  return Math.random();
}
