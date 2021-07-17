import m from "mithril";
import Stream from "mithril/stream";
import mapCapped from "lodash/fp/map";
import {styled} from "../lib/styled";
import {Controller} from "../lib/model";
import {AdvancementIcon} from "../components/AdvancementIcon";

const map = mapCapped.convert({cap: false});

const CriteriaList = styled.ul`
  list-style: disc;
`;

const mapCriteria = map((timestamp, id) => <li>{id} ({timestamp})</li>)

function AdvancementDetails(vnode) {
    const {advancement, progress} = vnode.attrs;

    return {
        view(vnode) {
            return <div>
                <AdvancementIcon advancement={advancement} progress={progress}/>
                <p>{(progress.percentage * 100).toFixed(2)}% complete</p>
                <CriteriaList>
                    {mapCriteria(progress.progress.criteria)}
                </CriteriaList>
            </div>
        }
    }
}

export function AdvancementPage(vnode) {
    const advancementId = m.route.param("advancement");
    const advancement = Stream(Controller.getAdvancementById(advancementId));
    const progress = advancement.map(Controller.getProgress);

    return {
        view(vnode) {
            return <div>
                {advancement()
                    ? <AdvancementDetails advancement={advancement()} progress={progress()}/>
                    : <div>No advancement with that ID :(</div>}
            </div>
        }
    }
}
