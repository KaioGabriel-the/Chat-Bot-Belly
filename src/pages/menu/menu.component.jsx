import '../menu/menu.component.css'
import { useNavigate } from "react-router-dom"; 

export default function Menu(){
    const navigate = useNavigate();

    function goTo(path){
        navigate(path);
    }

    return (
        <div className="menu-options">
            <h1>Menu de opções</h1>
            <div className="tag" onClick={() => goTo('/food')}>
                <h3>Alimentação</h3>
            </div>
            <div className="tag" onClick={ () => goTo('/behavior')}>
                <h3>Comportamentos</h3>
            </div>
            <div className="tag" onClick={goTo('/community')}>
                <h3>Comunidade</h3>
            </div>
        </div>
    );
}