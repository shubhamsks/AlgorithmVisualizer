export const breadthFirstSearch = (grid,source, destination)=>{
    const visitedNodesInOrder = [];
     let queue = [];
     queue.push(source);
     while (queue.length !== 0){
         let node = queue.shift();
         if(node.isWall)continue;
         if(node.isFinish)return visitedNodesInOrder;
         updateUnvisitedNeighbors(node,grid,queue);
         node.isVisited = true;
         visitedNodesInOrder.push(node);
     }
     return visitedNodesInOrder;
};
const updateUnvisitedNeighbors = (node, grid,queue) => {
    const unVisitedNeighbors = getUnvisitedNeighbors(grid, node);
    for(const neig of unVisitedNeighbors){
        let flag = false;
        for(const q of queue){
            if(neig === q){
                flag = true;
                break;
            }
        }
        if(flag)continue;
        else {
            queue.push(neig);
        }
        neig.prevNode = node;
    }
};

const getUnvisitedNeighbors = (grid, node) =>{
    const neighbors = [];
    const {row, col} = node;
    if(row > 0) neighbors.push(grid[row-1][col]);
    if(row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if(col > 0 ) neighbors.push(grid[row][col - 1]);
    if(col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((node)=> !node.isVisited);
};


export const getNodesInShortestPathOrder =(finishNode)=>{
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode); //pushes the element to the list
        currentNode = currentNode.prevNode;
    }
    return nodesInShortestPathOrder;
};