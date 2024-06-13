
class Graph {

    constructor(NoVertices){
        this.NoVertices = NoVertices;
        this.AdjList = new Map();
    }

    addVertex(node){
        this.AdjList.set(node, []);
    }

    addEdge(node, neighbour){
        this.AdjList.get(node).push(neighbour);

    }

    printGraph(){
        var get_keys = this.AdjList.keys();

        for (var i of get_keys){
            var get_values = this.AdjList.get(i);
            var conc = '';
        
            for (var j of get_values)
                conc +=j + '';
                console.log(i + " -> " + conc);
            
        }
    }
    displayGraph() {
        const container = document.getElementById('graph-container');
        this.AdjList.forEach((edges, vertex) => {
            let nodeElement = document.createElement('div');
            nodeElement.className = 'node';
            nodeElement.textContent = vertex;
            container.appendChild(nodeElement);
        });

    }

}



var vertices = [ 'G', 'U', 'S', 'T', 'A', 'V' ];
var g = new Graph(vertices.length);
// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}

g.displayGraph();