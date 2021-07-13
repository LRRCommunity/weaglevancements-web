import m from "mithril";
import map from "lodash/fp/map";
import _ from "lodash/fp/placeholder";
import { styled } from "../lib/styled";
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
  border-left: 2px inset #fff;
  border-top: 2px inset #fff;
  margin-left: 4em;
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
                <ProgressFront percent={vnode.attrs.percent} />
            </ProgressBack>
        }
    }
}

/* export function AdvancementGraph() {
    return {
        view() {
            const percent = Controller.getTotalPercentage();
            const mapper = map(_, Model.chunkedAdvancements);

            return <div>
                <Container>
                    <ProgressBar percent={percent} />
                    <p>The gang is currently {percent.toFixed(1)}% done</p>
                </Container>
                {mapper(bucket => <Category root={bucket[0][0]}>
                    {bucket.map(level => <LevelWrapper>
                        {level.map(adv => <AdvancementIcon advancement={adv} progress={Controller.getProgress(adv)} />)}
                    </LevelWrapper>)}
                </Category>)}
            </div>
        }
    }
}
*/
export function AdvancementGraph() {
    return {
        view() {
            const percent = Controller.getTotalPercentage();
            return <div>
                <Container>
                    <ProgressBar percent={percent} />
                    <p>The gang is currently {percent.toFixed(1)}% done</p>
                </Container>
				{DrawAdvancements(Model.advancementTree)}
				{Model.chunkedAdvancements}
            </div>
        }
    }
}
function DrawAdvancements(advancements) {
	if (advancements.length > 0) {
		let out = [];
		advancements.forEach((adv) => {
			if (!adv.parent && adv.display.background) {
				out.push(<Category root={adv}>
				<AdvancementIcon advancement={adv} progress={Controller.getProgress(adv)} />
				{DrawAdvancements(adv.children)}
			</Category>)
			} else {
				out.push(<LevelWrapper>
				<AdvancementIcon advancement={adv} progress={Controller.getProgress(adv)} />
				{DrawAdvancements(adv.children)}
				</LevelWrapper>)
			}
		});
		return <>
			{out}
			</>;
	}
}