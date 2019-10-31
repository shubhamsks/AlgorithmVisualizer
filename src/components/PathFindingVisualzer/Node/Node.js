import React,{Component} from 'react';
import  './Node.css';

export  default  class Node extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        const {isStart, isFinish, isWall, row, col, onMouseDown, onMouseEnter, onMouseUp} = this.props;
        const extraClass = isStart ? 'node-start': isFinish ? 'node-finish': isWall ? 'node-wall':'';
        // if(row === 10 && col === 5){
        //     console.log(row,col);
        //     console.log(extraClass);
        // }

        let classes = 'node' + ' '+extraClass;
        // if(row === 10 && col === 45){
        //     console.log(row,col);
        //     console.log(extraClass);
        //     console.log(classes)
        // }
        return(
            <div
                onMouseDown={()=>onMouseDown(row, col)}
                onMouseEnter={()=> onMouseEnter(row, col)}
                onMouseUp={()=> onMouseUp(row,col)}
                id={`node-${row}-${col}`}
                className= {classes} >
            </div>
        );
    }
}