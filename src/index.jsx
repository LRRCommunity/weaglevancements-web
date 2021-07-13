import m from "mithril";
import { styled } from "./lib/styled";
import {AdvancementGraph} from "./components/AdvancementGraph";
import {css} from "@emotion/css";
import {Controller} from "./lib/model";

const Container = styled.div`
  margin: 0 10px;
`

const Header = styled.h1`
  font-family: sans-serif;
`;

const StatusLine = styled.p`
  color: ${status => status.success ? "green" : "red"}
`;

function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function Index() {
    let handle = null;
    let lastRefreshStatus = {
        success: false,
        time: 0,
        error: null,
    };

    function refresh() {
        Controller.loadProgress()
            .then(() => {
                lastRefreshStatus.success = true;
                lastRefreshStatus.error = null;
                lastRefreshStatus.time = new Date();
            }).catch(err => {
                lastRefreshStatus.success = false;
                lastRefreshStatus.error = err;
                lastRefreshStatus.time = new Date();
            });
    }

    function statusLine() {
        if (lastRefreshStatus.success) {
            return `Successfully refreshed at ${formatTime(lastRefreshStatus.time)}`;
        } else {
            if (lastRefreshStatus.error == null) {
                return "Loading...";
            } else {
                return lastRefreshStatus.error.message;
            }
        }
    }

    return {
        oninit(vnode) {
			Controller.loadAdvancements();
            refresh();

            handle = setInterval(() => {
                refresh();
            }, 60 * 1000);
        },

        onremove(vnode) {
            clearInterval(handle);
        },

        view(vnode) {
            return <div>
                <Container>
                    <Header>Mine O'Clock Advancement Run</Header>
                    <p>by offbeatwitch! this is v0, it'll look nicer soon &#128516;</p>
                    <StatusLine success={lastRefreshStatus.success}>{statusLine()}</StatusLine>
                </Container>
                {Controller.isLoaded() && <AdvancementGraph/>}
            </div>
        }
    }
}

document.body.className = css`
  margin: 0;
`;

m.route(document.body, "/", {
    "/": Index,
});
