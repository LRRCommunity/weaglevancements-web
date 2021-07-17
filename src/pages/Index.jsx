import m from "mithril";
import {Controller} from "../lib/model";
import {AdvancementGraph} from "../components/AdvancementGraph";

export function Index() {
    return {
        view(vnode) {
            return <>
                {Controller.isLoaded() && <AdvancementGraph/>}
            </>
        }
    }
}
