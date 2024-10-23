import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import App from "../App";
import Login from "../Login";
import Dashboard from "../Dashboard/Dashboard";
import {TaskList} from "../Dashboard/Dashboard Components/TaskList";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/Login">
                <Login/>
            </ComponentPreview>
            <ComponentPreview path="/Dashboard">
                <Dashboard/>
            </ComponentPreview>
            <ComponentPreview path="/TaskList">
                <TaskList/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;