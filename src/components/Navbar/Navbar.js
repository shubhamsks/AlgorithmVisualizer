import  React from 'react';
import './Navbar.css'
class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selectedAlgorithm:null,
        }
    }
    handleMouseEnter=()=>{

    };
    algorithmSelectorHandler =(event)=>{
      console.log(event.target);
      console.log('here')
    };
   render() {
       return(
           <nav>
               <div className='dropdown'>
                   <div className='algorithms'>
                       <button onClick={this.algorithmSelectorHandler}>Select Algorithm</button>
                       <ul>
                           <button onClick={this.algorithmSelectorHandler}><p >Dijkstra</p></button>
                           <li onClick={this.algorithmSelectorHandler}><p>Breadth First Search</p></li>
                           <li onClick={this.algorithmSelectorHandler}><p >Dijkstra</p></li>
                       </ul>
                   </div>
                   <button onClick={this.props.clicked}>Visualize {this.props.algorithm}</button>
               </div>
           </nav>
       );
   }
}
export default Navbar;