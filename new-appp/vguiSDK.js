class VguiSDK {
  constructor(graphName) {
    this.listeners = [];
    this.connectToGraph(graphName);
  }

  async connectToGraph(graphName) {
    this.handle = await this.getGraphHandle(graphName);
    this.ws = this.createWS();
    await this.connectWS();
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  sendData(sceneConnector, port, content) {
    if (this.ws) {
      const data = {
        channel: sceneConnector,
        content: JSON.stringify({
          key: port,
          value: content
        })
      }
      this.ws.send(JSON.stringify(data));
    }
  }

  async listGraphs() {
    let result = await fetch('/app/pipeline-modeler/service/v1/runtime/graphs');
    return await result.json();
  }

  async getGraphHandle(graphName) {
    const runningGraphs = await this.listGraphs();
    const graph = runningGraphs.find(graph => graph.src === graphName);
    return graph && graph.handle;
  }

  createWS() {
    return new WebSocket(
      `wss://${window.location.host}/app/pipeline-modeler/vgui/${this.handle}/socket`
    );
  }

  connectWS() {
    return new Promise((resolve, reject) => {
      this.ws.onerror = () => {
        reject('Deu ruim!');
      };
      this.ws.onopen = () => {  
        this.ws.onmessage = (event) => {
          const parsedResult = JSON.parse(event.data);
          this.listeners.forEach(listener => listener(parsedResult));
        }

        this.ws.onclose = e => {
          console.log('fechou');
        };
        resolve();
      };
    });
  }
}