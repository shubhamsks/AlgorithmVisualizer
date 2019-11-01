import  React from 'react';
import './Navbar.css';
import Dropdown from './DropDown/DropDown';

const ALGORITHMS = {
    dkstr:'Dijkstra',
    bfs:'Breadth First Search',
};

class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            selectedAlgorithm:null,
        }
    }
    // handleMouseEnter=()=>{
    //
    // };
    algorithmSelectorHandler =(key)=>{
      console.log(key);
      const algorithm = ALGORITHMS[key];
      this.setState({selectedAlgorithm:algorithm});
    };
    handleAlgoRithmSelection = ()=>{
        const  algo = this.state.selectedAlgorithm;
        this.props.clickedAlgo(algo);
    };
   render() {
       const algorithmOptions = [
           {
               text:'Dijkstra',
               value:'dkstra',
               className:'dk',
               key:'dk',
               onClick:()=>this.algorithmSelectorHandler('dkstr')

           },
           {
               text: 'Breadth first search',
               className: 'bfs',
               key: 'bfs',
               value:'bfs',
               onClick:()=>this.algorithmSelectorHandler('bfs'),
           }
       ];

       return(
           <nav className='Nav'>

               <ul>
                   <li>
                       <h2 className='brand'>Path Finding Algorihtm visualizer</h2>
                   </li>
                    <li><div className='dropdown'>
                        <Dropdown text={this.state.selectedAlgorithm} algorithmOptions = {algorithmOptions}/>
                    </div>
                    </li>
               <li>
                   {
                       this.state.selectedAlgorithm ?
                       <button
                           onClick={this.handleAlgoRithmSelection}
                       >
                           Visualize {this.state.selectedAlgorithm}
                       </button> :
                       <button disabled={true}>
                           Visualize
                       </button>

                   }
                   <button onClick={this.props.clickedClearPath}>
                       Clear path
                   </button>
                   <button onClick={this.props.clickedClearGrid}>
                       Clear Grid
                   </button>
               </li>
               </ul>
           </nav>
       );
   }
}
export default Navbar;