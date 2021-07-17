import m from "mithril";
import {styled} from "./lib/styled";
import {Index} from "./pages/Index";
import {AdvancementPage} from "./pages/AdvancementDetails";
import {css} from "@emotion/css";
import {Controller} from "./lib/model";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

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

function Layout() {
    let handle = null;
    let lastRefreshStatus = {
        success: false,
        time: 0,
        error: null,
    };

    function refresh() {
        Controller.loadProgress().then(() => {
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
                    <p>by <a href="https://offbeatwit.ch">offbeatwitch</a>! v0.3 &#128516;</p>
                    <p>contributors: <a href="https://github.com/Anaerin">Anaerin</a>!</p>
                    <StatusLine success={lastRefreshStatus.success}>{statusLine()}</StatusLine>
                </Container>
                {vnode.children}
            </div>
        }
    }
}

function Root(Component) {
    return {
        render(vnode) {
            return <Layout>
                <Component/>
            </Layout>
        }
    }
}

document.body.className = css`
  margin: 0;
`;

m.route.prefix = "";
m.route(document.body, "/", {
    "/": Root(Index),
    "/adv/:advancement...": Root(AdvancementPage),
});
