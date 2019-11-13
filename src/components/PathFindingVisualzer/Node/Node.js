import React,{Component} from 'react';
import  './Node.css';

export  default  class Node extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        const {isStart, isFinish, isWall, row, col, onMouseDown, onMouseEnter, onMouseUp,isVisited} = this.props;
        const extraClass = isStart ? 'node-start': isFinish ? 'node-finish': isWall ? 'node-wall':isVisited? 'node-visited':'';

        let classes = 'node ' +extraClass;

        return(
            <td
                onMouseDown={()=>onMouseDown(row, col)}
                onMouseEnter={()=> onMouseEnter(row, col)}
                onMouseUp={()=> onMouseUp(row,col)}
                id={`node-${row}-${col}`}
                className= {classes} >
            </td>
        );
    }
}