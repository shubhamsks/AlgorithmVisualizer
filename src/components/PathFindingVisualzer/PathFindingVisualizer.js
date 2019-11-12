import  React,{Component} from 'react';

import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from "../../algorithms/dijkstra";
import {breadthFirstSearch} from "../../algorithms/breadthFirstSearch";
import Navbar from '../Navbar/Navbar';


let START_NODE_ROW = 12;
let START_NODE_COL = 17;
let FINISH_NODE_ROW = 12;
let FINISH_NODE_COL  = 45;
const hoverdNodes = [];
class PathFindingVisualizer extends  Component{
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            changeEndNode:false,
        };
    }
    createNode = (row, col)=>{
        const node = {
            row,
            col,
            distance : Infinity,
            prevNode: null,
            isWall :false,
            isStart:row === START_NODE_ROW && col === START_NODE_COL,
            isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
            isVisited:false,
        };
        return node;
    };
    // Creating initial grid with start and end node( No walls) when this component gets mount
    componentDidMount() {
        const grid = [];
        for(let row = 0; row < 25; row++){
            const currentRow =[];
            for(let col = 0; col < 75; col++){
                currentRow.push(this.createNode(row,col));
            }
            grid.push(currentRow);
        }
        this.setState({
            grid:grid,
        });
    }
    shouldComponentUpdate(nextProps, nextState){
        if(!nextState.mouseIsPressed){
            return true;
        }
        return false;
    }
    //Visualization part below
    animateAlgorithms(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i =  1; i <= visitedNodesInOrder.length - 1; i++) {
            if (i === visitedNodesInOrder.length - 1) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 1; i < nodesInShortestPathOrder.length  - 1; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }
    visualizeAlgo = (algo)=>{
        if(algo === 'Breadth First Search'){
            this.visualizeBreadthFirstSearch();
        }
        if(algo === 'Dijkstra'){
            this.visualizeDijkstra();
        }
    };

    visualizeDijkstra = () => {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateAlgorithms(visitedNodesInOrder, nodesInShortestPathOrder);
    };
    visualizeBreadthFirstSearch = () => {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateAlgorithms(visitedNodesInOrder, nodesInShortestPathOrder);
    };
    //Visualization part end

    //Handling part below
    // Animation lagging bug when creating walls (CSS :Probably)
    handleMouseDown = (row, col)=>{
        const newGrid = this.getNewGridWithBallToggled(this.state.grid,row,col);
        if(newGrid[row][col].isFinish){
            const grid = this.state.grid;
            grid[row][col].isFinish = false;
            this.setState({changeEndNode:true})
        }
        const node = newGrid[row][col];
        document.getElementById(`node-${node.row}-${node.col}`).className='node node-wall';
        hoverdNodes.push({row:row,col:col});
        this.setState({mouseIsPressed:true});
    };
    handleMouseEnter = (row,col)=>{
            if(!this.state.changeEndNode){
                if(!this.state.mouseIsPressed) return;
                const newGrid = this.getNewGridWithBallToggled(this.state.grid, row, col);
                const node = newGrid[row][col];
                document.getElementById(`node-${node.row}-${node.col}`).className='node node-wall';
                hoverdNodes.push({row:row,col:col});
                // this.setState({grid:newGrid});
            }
    };
    handleMouseUp = (row,col)=>{
        if(this.state.changeEndNode){
            const grid = this.state.grid;
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
            grid[row][col].isFinish = true;
        }
        const newGrid = this.state.grid.slice();
        for(const node of hoverdNodes){
            newGrid[node.row][node.col].isWall = true;
        }
        this.setState({mouseIsPressed:false, changeEndNode:false,grid:newGrid});
    };

    //Handling end

    // Handling grid  below
    getNewGridWithBallToggled = (grid,row,col)=>{
        const newGrid = grid.slice(); //copy
        console.log(newGrid[row][col]);
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    };
    // this method will clear the path and algorithm visited part 
    clearPath  =()=>{
        const grid = this.state.grid.slice();
        for(const row of grid){
            for(const node of row){
                if(!node.isWall && !node.isStart && !node.isFinish && node.isVisited){
                    document.getElementById(`node-${node.row}-${node.col}`).className ='node';
                    grid[node.row][node.col].isVisited=!grid[node.row][node.col].isVisited;
                }
            }
        }
        this.setState({grid:grid});
    };
    //This method is used to clear the grid after a path is visualized it clears both walls and path
    clearGrid  =()=>{
        const grid = this.state.grid.slice();
        for(const row of grid){
            for(const node of row){
                if(!node.isStart && !node.isFinish){
                    document.getElementById(`node-${node.row}-${node.col}`).className ='node';
                    grid[node.row][node.col].isVisited=false;
                    grid[node.row][node.col].isWall = false;
                }
            }
        }
        this.setState({grid:grid});

    };
    // This method is used to create random patterns in the grid with walls
    createRandomPatters=()=>{
        // this.clearGrid();
        const {grid} = this.state;
        const rows = [];
        for(let i = 0; i < 20; i++){
            rows.push(parseInt(Math.random()*i));
        }
        const cols = [];
        for(let i = 0; i < 50; i++){
            cols.push(parseInt(Math.random()*i));
        }
        for(const row of rows){
            for(const col of cols){
                const node = grid[row][col];
                if(node.isStart || node.isFinish){
                    continue;
                }
                else
                {
                    document.getElementById(`node-${row}-${col}`).className = 'node-wall';
                    grid[row][col].isWall = true;
                }
            }
        }
        this.setState({grid:grid});
    }
    // Creating a stair case pattern
    createStairCasePattern = ()=>{
        // this.clearGrid();
        const grid = this.state.grid.slice();
        let row = 22;
        let col = 0;
        for(let i = 0; i < 22; i++){
            const node = grid[row][col];
            if(node.isStart || node.isFinish){
                continue;
            }
            else
            {
                document.getElementById(`node-${row}-${col}`).className = 'node-wall';
                grid[row][col].isWall = true;                   
            }
            row--;
            col++;
        }
        for(let i = 0; i < 22; i++){
            const node = grid[row][col];
            if(node.isStart || node.isFinish){
                continue;
            }
            else
            {
                document.getElementById(`node-${row}-${col}`).className = 'node-wall';
                grid[row][col].isWall = true;                   
            }
            row++;
            col++;
        }
        for(let i = 0; i < 20; i++){
            const node = grid[row][col];
            if(node.isStart || node.isFinish){
                continue;
            }
            else
            {
                document.getElementById(`node-${row}-${col}`).className = 'node-wall';
                grid[row][col].isWall = true;                   
            }
            row--;
            col++;
        }
        this.setState({grid:grid});
    }
    render() {
        const {grid}= this.state;
        return <div>
            <Navbar
                clickedAlgo ={(algo)=>this.visualizeAlgo(algo)}
                clickedClearPath ={this.clearPath}
                clickedClearGrid = {this.clearGrid}
                clickedMakeRandomPattern  = {this.createStairCasePattern}
                />
            <div>
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {row,col, isFinish, isStart, isWall,isVisited} = node;
                                return (
                                    <Node
                                        key = {nodeIdx}
                                        row = {row}
                                        col = {col}
                                        isStart = {isStart}
                                        isFinish = {isFinish}
                                        isWall = {isWall}
                                        isVisited = {isVisited}
                                        onMouseDown = {(row, col)=>this.handleMouseDown(row,col)}
                                        onMouseEnter= {(row,col)=>this.handleMouseEnter(row,col)}
                                        onMouseUp = {(row,col)=>this.handleMouseUp(row,col)}
                                        />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    }
}
export  default PathFindingVisualizer;