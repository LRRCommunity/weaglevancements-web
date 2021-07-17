import m from "mithril";
import {Link} from "mithril/route";
import Stream from "mithril/stream";
import mapCapped from "lodash/fp/map";
import {styled} from "../lib/styled";
import {Controller} from "../lib/model";
import {AdvancementIcon} from "../components/AdvancementIcon";
import {Category} from "../components/AdvancementGraph";

const map = mapCapped.convert({cap: false});

const CriteriaList = styled.ul`
  list-style: disc;
`;

const ReturnLink = styled(Link)`
  color: inherit;
  display: block;
  margin-bottom: 25px;
  font-size: 1.5em;
  
  &:visited {
    color: inherit;
  }
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
    const isLoaded = Stream(Controller.isLoaded());
    const advancementId = m.route.param("advancement");
    const advancement = isLoaded.map(loaded => loaded ? Controller.getAdvancementById(advancementId) : Stream.SKIP);
    const progress = advancement.map(Controller.getProgress);
    const root = advancement.map(adv => Controller.findRoot(adv));

    return {
        onupdate(vnode) {
            isLoaded(Controller.isLoaded());

            if (isLoaded()) m.redraw();
        },

        view(vnode) {
            if (!isLoaded()) {
                return <div>No advancement with that ID :(</div>;
            }

            return <Category root={root()}>
                <ReturnLink href="/">&lt;- back to list</ReturnLink>
                <AdvancementDetails advancement={advancement()} progress={progress()}/>
            </Category>
        }
    }
}
