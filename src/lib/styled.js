import m from "mithril";
import {css} from "@emotion/css";

function makeStyledElement(tag) {
    return new Proxy(function() {}, {
        apply(target, thisArg, argArray) {
            const mapProps = props => {
                let mappedArgs = argArray.map(arg => {
                   if (typeof arg === "function") {
                       return arg(props);
                   } else {
                       return arg;
                   }
                });

                return css.apply(thisArg, mappedArgs);
            };

            return {
                view(vnode) {
                    return m(tag, { class: mapProps(vnode.attrs), ...vnode.attrs }, vnode.children);
                }
            }
        }
    });
}

export const styled = new Proxy({}, {
    get(target, p, receiver) {
        return makeStyledElement(p);
    }
});
