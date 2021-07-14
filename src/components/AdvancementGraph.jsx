import m from "mithril";
import {styled} from "../lib/styled";
import {AdvancementIcon} from "./AdvancementIcon";
import {Controller, Model} from "../lib/model";

const BASE_URL = "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.17/assets/minecraft";

function backgroundFromId(background) {
    const path = background.split(":")[1];

    return `${BASE_URL}/${path}`;
}

const Container = styled.div`
  padding: 0 10px;
`;

const Category = styled.div`
  background-size: cover;
  background: url("${props => backgroundFromId(props.root.display.background)}") repeat rgba(0, 0, 0, 0.5);
  background-blend-mode: multiply;
  color: #fff;
  padding: 10px;
`;

const LevelWrapper = styled.div`
  margin-left: 2em;
  position: relative;
  
  @media(max-width: 700px) {
    margin-left: 0.3em;
  }
`;

const ProgressBack = styled.div`
  background: #a0a0a0;
  width: 100%;
  height: 20px;
  position: relative;
`;

const ProgressFront = styled.div`
  width: ${props => props.percent}%;
  height: 100%;
  position: absolute;
  background: forestgreen;
`;

function ProgressBar() {
    return {
        view(vnode) {
            return <ProgressBack>
                <ProgressFront percent={vnode.attrs.percent}/>
            </ProgressBack>
        }
    }
}

export function AdvancementGraph() {
    return {
        view() {
            const percent = Controller.getTotalPercentage();
            return <div>
                <Container>
                    <ProgressBar percent={percent}/>
                    <p>The gang is currently {percent.toFixed(1)}% done</p>
                </Container>
                {drawAdvancements(Model.advancementTree)}
            </div>
        }
    }
}

function drawAdvancements(advancementTree) {
    return advancementTree.map(entry => {
        if (!entry.item.parent) {
            return <Category root={entry.item}>
                <AdvancementIcon advancement={entry.item} progress={Controller.getProgress(entry.item)}/>
                {drawAdvancements(entry.children)}
            </Category>
        } else {
            return <LevelWrapper>
                <AdvancementIcon advancement={entry.item} progress={Controller.getProgress(entry.item)}/>
                {drawAdvancements(entry.children)}
            </LevelWrapper>
        }
    });
}
