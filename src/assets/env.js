(function (window) {
  window['env'] = window['env'] || {};

  window['env']['api'] = [
    {
      id: 'tezedge.master.dev.tezedge.com',
      name: 'tezedge.master.dev.tezedge.com',
      http: 'https://master.dev.tezedge.com:8752',
      p2p_port: '9732',
      features: [
        { name: 'ws', url: 'wss://master.dev.tezedge.com:443' },
        { name: 'debugger', url: 'http://master.dev.tezedge.com:17732' },
        { name: 'sandbox', url: 'http://localhost:3030' },
        { name: 'commit', id: '' },
        { name: 'monitoring' },
        { name: 'resources/system', monitoringUrl: 'https://master.dev.tezedge.com:8754/resources/tezedge' },
        { name: 'resources/memory', memoryProfilerUrl: 'http://master.dev.tezedge.com:17832' },
        { name: 'resources/storage' },
        { name: 'mempool' },
        { name: 'storage' },
        { name: 'network' },
        { name: 'logs' },
      ]
    },
    {
      id: 'octez.master.dev.tezedge.com',
      name: 'octez.master.dev.tezedge.com',
      http: 'https://master.dev.tezedge.com:8742',
      p2p_port: '9733',
      features: [
        { name: 'debugger', url: 'http://master.dev.tezedge.com:17732' },
        { name: 'sandbox', url: 'http://localhost:3030' },
        { name: 'monitoring' },
        { name: 'resources/system', monitoringUrl: 'http://master.dev.tezedge.com:38732/resources/ocaml' },
        { name: 'resources/memory', memoryProfilerUrl: 'http://master.dev.tezedge.com:17832' },
        { name: 'resources/storage' },
        { name: 'mempool' },
        { name: 'network' },
        { name: 'logs' },
      ]
    }
  ];
})(this);
