

export const dijkstra = (grid, source, destination)=>{
    const visitedNodesInOrder = [];
    source.distance = 0;
    const unVisitedNodes = getAllNodes(grid);
    while(true){
        // Min heap or priority queue should be used here but we don't require that much of customization so i am sorting the elements
        // every time we visit new node
        unVisitedNodes.sort((nodeA, nodeB)=> nodeA.distance  - nodeB.distance);
        const closestNode = unVisitedNodes.shift();
        if(closestNode.isWall) continue;
        // There are walls every where we must quit to find the shortest path
        if(closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if(closestNode === destination) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid);
    }

};
// updates all the surronding nodes of a current node in the grid
const updateUnvisitedNeighbors = (node, grid) => {
    const unVisitedNeighbors = getUnvisitedNeighbors(grid, node);
    for(const neig of unVisitedNeighbors){
        neig.distance = node.distance + 1;
        neig.prevNode = node;
    }
};
// Return all the unvisted nodes of the current node
const getUnvisitedNeighbors = (grid, node)=>{
    const neighbors = [];
    const {row, col} = node;
    if(row > 0) neighbors.push(grid[row-1][col]);
    if(row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if(col > 0 ) neighbors.push(grid[row][col - 1]);
    if(col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((node)=> !node.isVisited);
};
const getAllNodes=(grid)=>{
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
};
//Climent's code
// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
//@sk
// Basicaly all it do is just that
// Starting from end node every node has a prevnode pointer it goes to that node and then do it till it reaches
// the start which will have null prevnode and loop will terminate
export const getNodesInShortestPathOrder =(finishNode)=>{
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode); //pushes the element to the list
        currentNode = currentNode.prevNode;
    }
    return nodesInShortestPathOrder;
};
