import m from "mithril";
import {styled} from "../lib/styled";

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

export function ProgressBar() {
    return {
        view(vnode) {
            return <ProgressBack>
                <ProgressFront percent={vnode.attrs.percent}/>
            </ProgressBack>
        }
    }
}
