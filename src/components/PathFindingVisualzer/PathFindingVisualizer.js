import  React,{Component} from 'react';

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
    };

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

    //Handling end
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
    clearPath  =()=>{
        const {grid} = this.state;
        for(const row of grid){
            for(const node of row){
                if(!node.isWall && !node.isStart && !node.isFinish){
                    document.getElementById(`node-${node.row}-${node.col}`).className ='node';
                    grid[node.row][node.col].isVisited=false;
                }
            }
        }
        this.setState({grid:grid});
    };
    clearGrid  =()=>{
        console.log('cleargrid ')
        const {grid} = this.state;
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
    render() {
        const {grid}= this.state;
        return <div>
            <Navbar
                clickedAlgo ={(algo)=>this.visualizeAlgo(algo)}
                clickedClearPath ={this.clearPath}
                clickedClearGrid = {this.clearGrid}/>
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