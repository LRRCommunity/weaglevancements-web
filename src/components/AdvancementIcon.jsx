import m from "mithril";
import { styled } from "../lib/styled";

import translations  from "../assets/translations.json";
import Task from "../assets/sprites/task_incomplete.png";
import TaskComplete from "../assets/sprites/task_complete.png";
import Challenge from "../assets/sprites/challenge_incomplete.png";
import ChallengeComplete from "../assets/sprites/challenge_complete.png";
import Goal from "../assets/sprites/goal_incomplete.png";
import GoalComplete from "../assets/sprites/goal_complete.png";
import {OVERRIDE_LIST} from "../lib/overrides";

const BASE_URL = "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.17/assets/minecraft";

function advToSprite(props) {
    if (props.type === "goal") {
        return props.complete ? GoalComplete : Goal;
    } else if (props.type === "challenge") {
        return props.complete ? ChallengeComplete : Challenge;
    } else {
        return props.complete ? TaskComplete : Task;
    }
}

function iconToUrl(icon) {
    if (OVERRIDE_LIST.hasOwnProperty(icon.item)) {
        return OVERRIDE_LIST[icon.item];
    }

    const [_domain, path] = icon.item.split(":");

    return `${BASE_URL}/textures/item/${path}.png`;
}

function translate(text) {
    return translations[text.translate];
}

const Advancement = styled.div`
  font-family: sans-serif;
  display: inline-block;
  flex: 1 1;
`;

const AdvancementFrame = styled.span`
  background: url("${advToSprite}");
  background-size: cover;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  display: inline-block;
  width: 64px;
  height: 64px;
  margin-right: 5px;
`;

const AdvancementImage = styled.img`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 12px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
`;

const DescriptionBlock = styled.div`
  display: inline-block;
  vertical-align: top;
  
  & h2, & p {
    margin: 2px 0;
  }
`;

export function AdvancementIcon() {
    return {
        view(vnode) {
            const { advancement, progress } = vnode.attrs;
            const completed = progress != null ? progress.progress.done : false;

            return <Advancement>
                <AdvancementFrame type={advancement.display.frame} complete={completed}>
                    <AdvancementImage src={iconToUrl(advancement.display.icon)} />
                </AdvancementFrame>
                <DescriptionBlock>
                    <h2>{translate(advancement.display.title)}</h2>
                    <p>{translate(advancement.display.description)}</p>
                </DescriptionBlock>
            </Advancement>
        }
    }
}
