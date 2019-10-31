import  React,{Component} from 'react';
import classes from './PathFindingVisualizer.module.css';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from "../../algorithms/dijkstra";
import {breadthFirstSearch} from "../../algorithms/breadthFirstSearch";
import Navbar from '../Navbar/Navbar';

let START_NODE_ROW = 10;
let START_NODE_COL = 5;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL  = 45;
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
    }

    componentDidMount() {
        const grid = [];
        for(let row = 0; row < 20; row++){
            const currentRow =[];
            for(let col = 0; col < 60; col++){
                currentRow.push(this.createNode(row,col));
            }
            grid.push(currentRow);
        }
        this.setState({
            grid:grid,
        });
    }
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
    handleMouseDown = (row, col)=>{
        const newGrid = this.getNewGridWithBallToggled(this.state.grid,row,col);
        if(newGrid[row][col].isFinish){
            const grid = this.state.grid;
            grid[row][col].isFinish = false;
            this.setState({changeEndNode:true})
        }
        this.setState({grid:newGrid,mouseIsPressed:true});
    };
    handleMouseEnter = (row,col)=>{
            if(!this.state.changeEndNode){
                if(!this.state.mouseIsPressed) return;
                const newGrid = this.getNewGridWithBallToggled(this.state.grid, row, col);
                this.setState({grid:newGrid});
            }
    };
    handleMouseUp = (row,col)=>{
        if(this.state.changeEndNode){
            const grid = this.state.grid;
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
            grid[row][col].isFinish = true;
        }
        this.setState({mouseIsPressed:false, changeEndNode:false});
    };
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
    changeEndNode=(row,col,grid)=>{

    };

    render() {
        const {grid}= this.state;
        return <div>
            {/*<button onClick={this.visualizeBreadthFirstSearch}>Visualize bfs</button>*/}
            {/*<button onClick={this.visualizeDijkstra}>Visualize dijkstra</button>*/}
            <Navbar clicked ={this.visualizeDijkstra} algorithm = 'Dijkstra'/>
            <div>
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {row,col, isFinish, isStart, isWall} = node;
                                return (
                                    <Node
                                        key = {nodeIdx}
                                        row = {row}
                                        col = {col}
                                        isStart = {isStart}
                                        isFinish = {isFinish}
                                        isWall = {isWall}
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