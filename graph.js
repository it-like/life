
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
        this.AdjList.get(neighbour).push(node);
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
}



var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F' ];
var g = new Graph(vertices.length);
// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}

// adding edges
g.addEdge('A', 'B');
g.addEdge('A', 'D');
g.addEdge('A', 'E');
g.addEdge('B', 'C');
g.addEdge('D', 'E');
g.addEdge('E', 'F');
g.addEdge('E', 'C');
g.addEdge('C', 'F');

// prints all vertex and
// its adjacency list
// A -> B D E
// B -> A C
// C -> B E F
// D -> A E
// E -> A D F C
// F -> E C
g.printGraph();