import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Ellipse, Circle, Line, Arrow, Text, Rect, Group } from "react-konva";
import Heap from 'heap-js';

var counter = 1;
var linecounter = 1;
var loopcounter = 1;
const minHeap = new Heap();
const stageRef = React.createRef();

export default class MainCanvas extends Component {
    state = {
        isBipartite: true,
        delete: false,
        color: false,
        numComponents: 0,
        undirected: true,
        canvas: [],
        lines: [],
        loops: [],
        bridgeDict: {},
        showBridges: false,
        adjList: {},
        edgenodestart: [null, null, null],
    };

    generateNode = (pos) => {
        var newNode = {};
        if (minHeap.length > 0) {
            var newid = minHeap.pop();
            newNode = {
                id: newid,
                x: pos.x,
                y: pos.y,
                width: 40,
                height: 40,
                fill: "white"
            }
            counter -= 1;
        } else {
            newNode = {
                id: counter,
                x: pos.x,
                y: pos.y,
                width: 40,
                height: 40,
                fill: "white"
            }
        }
        return newNode;
    }

    handleClick = (e) => {
        if (this.state.delete != true) {
            const emptySpace = e.target === e.target.getStage();
            if (!emptySpace) {
                return;
            }
            const pos = e.target.getStage().getPointerPosition();
            var newnode = this.generateNode(pos);
            counter += 1
            this.setState(prevState => ({
                canvas: [...prevState.canvas, { ...newnode }],
                edgenodestart: [null, null, null]

            }), () => this.genAdjlist());
        }
    };

    handleDragStart = e => {
        e.target.moveToTop();
        e.target.to({
            scaleX: 1.15,
            scaleY: 1.15,
        });
    };

    handleDragEnd = e => {
        var newnodes = [...this.state.canvas];
        var nodeid = e.target.attrs.id;
        for (var i = 0; i < newnodes.length; i += 1) {
            if (newnodes[i].id === parseInt(nodeid)) {
                newnodes[i].x = e.target.attrs.x;
                newnodes[i].y = e.target.attrs.y;
                break;
            }
        }
        var newloops = [...this.state.loops];
        for (var i = 0; i < newloops.length; i += 1) {
            if (newloops[i].nodeid === nodeid) {
                newloops[i].x = e.target.attrs.x;
                newloops[i].y = e.target.attrs.y - 40;
                break;
            }
        }
        this.setState({
            loops: newloops,
            canvas: newnodes
        })
        e.target.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: 1,
            scaleY: 1,
        });
    };
    addEdge = (e) => {
        if (this.state.color === true && this.state.delete == false) {
            var newnodes = [...this.state.canvas];
            for (var i = 0; i < newnodes.length; i += 1) {
                if ((newnodes[i].id) === parseInt(e.target.attrs.id)) {
                    if (newnodes[i].fill === "white") {
                        newnodes[i].fill = "#007bff"
                    }
                    else if (newnodes[i].fill === "#007bff") {
                        newnodes[i].fill = "#ff5353"
                    }
                    else {
                        newnodes[i].fill = "white"
                    }
                    break;
                }
            }
            this.setState({
                canvas: newnodes,
                edgenodestart: [null, null, null]
            })
            return;
        }
        var layer = stageRef.current;
        if (this.state.delete === true) {
            var nodedeleteid = e.target.attrs.id;
            var nodedelete = layer.findOne('#' + e.target.attrs.id);
            var lines = layer.find('.line');
            var linedeleteids = {};
            for (i = 0; i < lines.length; i += 1) {
                if (lines[i].attrs.startid === nodedelete.attrs.id || lines[i].attrs.endid === nodedelete.attrs.id) {
                    linedeleteids[lines[i].attrs.id] = true;
                }
            }
            var newlines = [...this.state.lines];
            for (var i = newlines.length - 1; i > -1; i -= 1) {
                if (("line" + newlines[i].id) in linedeleteids) {
                    newlines.splice(i, 1);
                }
            }
            this.setState({
                lines: newlines
            })
            var newnodes = [...this.state.canvas];
            for (var i = 0; i < newnodes.length; i += 1) {
                if (parseInt(newnodes[i].id) === parseInt(nodedelete.attrs.id)) {
                    newnodes.splice(i, 1);
                    break;
                }
            }
            this.setState({
                canvas: newnodes
            })
            minHeap.push(parseInt(nodedeleteid));
            var newloops = [...this.state.loops];
            for (var i = 0; i < newloops.length; i += 1) {
                if ((newloops[i].nodeid) === nodedeleteid) {
                    newloops.splice(i, 1);
                    break;
                }
            }
            this.setState({
                loops: newloops
            }, () => this.genAdjlist());
            this.setState({
                edgenodestart: [null, null, null]
            })
            return;
        }
        if (this.state.edgenodestart[0] == null) {
            this.setState({
                edgenodestart: [e.target.attrs.id, e.target.attrs.x, e.target.attrs.y]
            })
        } else {
            if (e.target.attrs.id === this.state.edgenodestart[0]) { // create loop
                var prevloop = layer.findOne('#loop' + e.target.attrs.id); // check if there is already loop
                if (prevloop === undefined) {
                    this.setState({
                        edgenodestart: [null, null, null]
                    })
                    var label = layer.findOne('#label' + e.target.attrs.id);
                    e.target.moveToTop();
                    label.moveToTop();
                    var newLoop = {
                        nodeid: e.target.attrs.id,
                        id: loopcounter,
                        x: e.target.attrs.x,
                        y: e.target.attrs.y - 40,
                        width: 25,
                        height: 40
                    }
                    loopcounter += 1;
                    var newloop = this.state.loops.concat(newLoop);
                    this.setState({ loops: newloop }, () => this.genAdjlist())
                    this.setState({
                        edgenodestart: [null, null, null]
                    })
                    return
                }
                this.setState({
                    edgenodestart: [null, null, null]
                })
                return
            }
            var flag = 0;
            var nodestart = this.state.edgenodestart[0];
            var nodestartx = this.state.edgenodestart[1];
            var nodestarty = this.state.edgenodestart[2];
            var nodeend = e.target.attrs.id;
            var nodeendx = e.target.attrs.x;
            var nodeendy = e.target.attrs.y;
            var lines = layer.find('.line');
            var numlines = 0;
            var i = 0
            for (i = 0; i < lines.length; i += 1) {
                if ((lines[i].attrs.startid === nodestart && lines[i].attrs.endid === nodeend) || (lines[i].attrs.startid === nodeend && lines[i].attrs.endid === nodestart)) {

                    flag = 1;
                    numlines += 1;
                }
            }
            const radius = -50;
            let angle = 0;
            var flag = 0;
            if (nodestartx >= nodeendx) {
                flag = 1;
            }
            const dx = nodestartx - nodeendx;
            const dy = nodestarty - nodeendy;
            angle = Math.atan2(-dy, dx);
            if (numlines === 0) {
                nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI) * .5);
                nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI) * .5);
                nodeendx = nodeendx + -radius * (Math.cos(angle) * .5);
                nodeendy = nodeendy + radius * (Math.sin(angle) * .5);
            }
            else if (numlines === 1) {
                if (flag != 1) {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - .5) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - .5) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle + .5) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle + .5) * .5);
                } else {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + .5) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + .5) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle - .5) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle - .5) * .5);
                }
            }
            else if (numlines === 2) {

                if (flag != 1) {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + .5) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + .5) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle - .5) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle - .5) * .5);
                } else {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - .5) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - .5) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle + .5) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle + .5) * .5);
                };
            }
            else {
                this.setState({
                    edgenodestart: [null, null, null]
                })
                return;
            }

            var isgrouped = false;
            var groupnumber = numlines + 1;
            if (numlines > 0) {
                isgrouped = true;
            }
            var newline = {
                id: linecounter,
                startid: nodestart,
                endid: nodeend,
                points: [nodestartx, nodestarty, nodeendx, nodeendy],
                isgrouped: isgrouped,
                fill: 'black',
                groupnumber: groupnumber
            }
            this.setState(prevState => ({
                lines: [...prevState.lines, { ...newline }]
            }), () => this.genAdjlist());
            this.setState({
                edgenodestart: [null, null, null]
            })
            linecounter += 1;

        }

    }

    updateLine = (e) => {
        var nodeid = e.target.attrs.id;
        var layer = stageRef.current;
        //UPDATE ALL LINES
        var lines = layer.find('.line');
        for (var i = 0; i < lines.length; i += 1) {
            if (lines[i].attrs.startid === nodeid) {
                var nodestart = layer.findOne('#' + lines[i].attrs.startid);
                var nodeend = layer.findOne('#' + lines[i].attrs.endid);
                var flag = 0;
                var nodestartx = nodestart.attrs.x;
                var nodestarty = nodestart.attrs.y;
                var nodeendx = nodeend.attrs.x;
                var nodeendy = nodeend.attrs.y;
                if (nodestartx >= nodeendx) {
                    flag = 1;
                }
                const radius = -50;
                const dx = nodestartx - nodeendx;
                const dy = nodestarty - nodeendy;
                let angle = Math.atan2(-dy, dx);
                if (lines[i].attrs.groupnumber === 1 || lines[i].attrs.isgrouped === false) {
                    var curpoints = lines[i].attrs.points
                    nodestartx = e.target.attrs.x + -radius * (Math.cos(angle + Math.PI) * .5);
                    nodestarty = e.target.attrs.y + radius * (Math.sin(angle + Math.PI) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle) * .5);
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber === 2) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + .5) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - .5) * .5);
                    }

                    var curpoints = lines[i].attrs.points
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber === 3) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - .5) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + .5) * .5);
                    }

                    var curpoints = lines[i].attrs.points
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    lines[i].attrs.points = curpoints;
                }
            }
            if (lines[i].attrs.endid === nodeid) {
                var nodestart = layer.findOne('#' + lines[i].attrs.startid);
                var nodeend = layer.findOne('#' + lines[i].attrs.endid);
                var nodestartx = nodestart.attrs.x;
                var nodestarty = nodestart.attrs.y;
                var nodeendx = nodeend.attrs.x;
                var nodeendy = nodeend.attrs.y;
                const radius = -50;
                var flag = 0;
                var nodestartx = nodestart.attrs.x;
                var nodestarty = nodestart.attrs.y;
                var nodeendx = nodeend.attrs.x;
                var nodeendy = nodeend.attrs.y;
                if (nodestartx >= nodeendx) {
                    flag = 1;
                }
                const dx = nodestartx - nodeendx;
                const dy = nodestarty - nodeendy;
                let angle = Math.atan2(-dy, dx);

                if (lines[i].attrs.groupnumber === 1 || lines[i].attrs.isgrouped === false) {
                    var curpoints = lines[i].attrs.points
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle) * .5);

                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber === 2) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + .5) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - .5) * .5);
                    }
                    var curpoints = lines[i].attrs.points
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber === 3) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - .5) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - .5) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - .5) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + .5) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + .5) * .5);
                    }

                    var curpoints = lines[i].attrs.points
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    lines[i].attrs.points = curpoints;
                }

            }

        }
        // update position of loops and labels
        var editnode = layer.findOne('#' + nodeid);
        var loop = layer.findOne('#loop' + nodeid);
        if (loop) {
            loop.position({ x: editnode.attrs.x, y: editnode.attrs.y - 40 })
        }
        var label = layer.findOne('#label' + nodeid);
        if (label) {
            label.moveToTop();
            label.position({ x: nodeid > 9 ? editnode.attrs.x - 9 : editnode.attrs.x - 4, y: editnode.attrs.y - 5 });
        }
    }

    genAdjlist = (returnundirected) => {
        var layer = stageRef.current;
        var lines = layer.find('.line');
        var adjList = {};
        for (var i = 0; i < this.state.canvas.length; i += 1) {
            adjList[this.state.canvas[i].id] = [];
        }
        for (var i = 0; i < this.state.loops.length; i += 1) {
            var selfid = this.state.loops[i].nodeid;
            adjList[selfid].push(selfid);
        }
        for (var i = 0; i < lines.length; i += 1) {
            var startend = [lines[i].attrs.startid, lines[i].attrs.endid];
            adjList[startend[0]].push(parseInt(startend[1]));
            if (this.state.undirected === true || returnundirected === true) {
                adjList[startend[1]].push(parseInt(startend[0]));
            }
        }
        if (!returnundirected) {
            this.setState({ adjList: adjList }, () => {
                this.isBipartite();
                this.numComponents();
                this.findBridges();
            }
            );
        }
        if (returnundirected === true) {
            return adjList;
        }
    }

    numComponents = () => {
        var numComponents = 0;
        var visited = {};
        var queue = [];
        for (const adjDict in this.state.adjList) {
            if (adjDict in visited === false) {
                numComponents += 1;
                queue.push(adjDict);
                visited[adjDict] = true;
                while (queue.length > 0) {
                    var curnode = queue.shift();
                    for (var i = 0; i < this.state.adjList[curnode].length; i += 1) {
                        if (this.state.adjList[curnode][i] in visited === false) {
                            queue.push(this.state.adjList[curnode][i]);
                            visited[this.state.adjList[curnode][i]] = true;
                        }
                    }
                }
            }
        }
        this.setState({
            numComponents: numComponents
        })
    }

    topologicalSort = () => {
        var processed = {};
        var visiting = {};
        var stack = [];
        for (var node in this.state.adjList) {
            if (node in processed != true) {

                if (dfs(node, visiting, processed, stack, this.state.adjList)) {
                    return [];
                }
            }
        }
        stack.reverse()
        return stack;
        function dfs(node, cyclecheck, processed, output, adjList) {
            if (node in processed) {
                return false;
            }
            if (node in cyclecheck) {
                return true; // we want to bubble up true in case there is cycle in directed graph.
            }
            cyclecheck[node] = true;
            for (var i = 0; i < adjList[node].length; i += 1) {
                var foundcycle = dfs(adjList[node][i], cyclecheck, processed, output, adjList);
                if (foundcycle) {
                    return true;
                }
            }
            delete cyclecheck[node];
            processed[node] = true;
            output.push(",");
            output.push(parseInt(node));
            return false
        }
    }

    isBipartite = () => {
        var isBipartite = true;
        if (this.state.lines.length === 0 && this.state.loops.length === 0) {
            //dont do anything if there arent any edges
        } else {
            if (this.state.undirected === false) { // we always want to treat the graph as undirected when checking if it is bipartite
                var adjList = this.genAdjlist(true);
            } else {
                var adjList = this.state.adjList;
            }
            let colors = {}; // will store the color of each node with false and true
            for (var adjDict in this.state.adjList) {
                if (adjDict in colors === false) {// only do bfs on nodes that werent visited
                    var queue = [] // queue for breadth first search
                    queue.push([adjDict, false, -1]);
                    colors[adjDict] = false; // mark visited
                    while (queue.length > 0) {
                        var curnode = queue.shift();// pop first node by shifting array
                        for (var i = 0; i < adjList[curnode[0]].length; i += 1) {
                            if (adjList[curnode[0]][i] === curnode[2]) {
                                // we dont want to go back to the neighbor we previosly visited
                                continue;
                            }
                            if (adjList[curnode[0]][i] in colors === true && colors[adjList[curnode[0]][i]] != curnode[1]) {
                                // in case we reach node that is visited but is the opposite color then we also know the rest of its neighbors and so on are bipartite
                                continue;
                            }
                            if (adjList[curnode[0]][i] in colors === true && colors[adjList[curnode[0]][i]] === curnode[1]) {
                                // in case we reach a visited node that wasnt started on and its color is the same as the current color then not bipartite
                                isBipartite = false;
                                break;
                            }
                            // push neighbor to queue
                            colors[adjList[curnode[0]][i]] = !curnode[1]; // mark visited
                            queue.push([adjList[curnode[0]][i], !curnode[1], curnode[0]]);
                        }
                    }
                }
            }
        }
        this.setState({
            isBipartite: isBipartite
        });
    }

    findBridges = () => {
        var bridgeDict = {};
        if (this.state.undirected === true && this.state.showBridges === true) {
            var initTime = {};
            var lowestAncestor = {};
            var timer = 1;
            for (var node in this.state.adjList) {
                if (node in initTime === false) {
                    // do dfs if not visited
                    dfs(parseInt(node), -1, initTime, lowestAncestor, timer, this.state.adjList);
                }
            }
        }
        this.setState({
            bridgeDict: bridgeDict
        }, () => this.showBridges());
        function dfs(node, parent, initTime, lowestAncestor, timer, adjList) {
            initTime[node] = timer;
            lowestAncestor[node] = timer;
            timer += 1
            if (adjList[node] != []) {
                for (var child = 0; child < adjList[node].length; child += 1) {
                    if (adjList[node][child] === parent) { // dont go back to parent
                        continue;
                    }
                    else if (adjList[node][child] in initTime) {// found visited node so update low of curnode if it is 
                        lowestAncestor[node] = Math.min(initTime[adjList[node][child]], lowestAncestor[node])
                    } else {// child not visited
                        dfs(adjList[node][child], node, initTime, lowestAncestor, timer, adjList);
                        if (lowestAncestor[adjList[node][child]] > initTime[node]) {// if only way to child is from parent then it is bridge
                            //checks for parallel edges since it wont be a bridge if there is another edge
                            var counter = 0;
                            for (var j = 0; j < adjList[node].length; j += 1) {
                                if (adjList[node][j] === adjList[node][child]) {
                                    counter += 1;
                                }
                            }
                            if (counter < 2) { // if no other edge going from node to child other than one, then its a bridge.
                                bridgeDict[[node, adjList[node][child]]] = true;
                            }
                        } else { // otherwise update the lowest ancestor reachable from current node ny seeing if the childs lowest acnestor is lower
                            lowestAncestor[node] = Math.min(lowestAncestor[node], lowestAncestor[adjList[node][child]]);
                        }
                    }
                }
            }
        }
    }

    deleteLine = (e) => {
        var newlines = [...this.state.lines];
        for (var i = 0; i < newlines.length; i += 1) {
            if ("line" + newlines[i].id === e.target.attrs.id) {
                newlines.splice(i, 1);
                break;
            }
        }
        this.setState({
            lines: newlines
        }, () => this.genAdjlist());
    }

    deleteLoop = (e) => {
        var newloops = [...this.state.loops];
        for (var i = 0; i < newloops.length; i += 1) {
            if (("loop" + newloops[i].nodeid) === e.target.attrs.id) {
                newloops.splice(i, 1);
                break;
            }
        }
        this.setState({
            loops: newloops
        }, () => this.genAdjlist())
    }

    changeUndirected = (val) => {
        if (val) {
            this.setState((prevState) => ({ undirected: true }), () => this.genAdjlist());
        } else {
            this.setState((prevState) => ({ undirected: false }), () => this.genAdjlist());
        }

    }

    createntries = () => {
        var JSXadjList = [];
        JSXadjList.push(<li className="listitems" key={node} style={{ margin: "13px", minWidth: "110px" }}>Adjacency List:</li>);
        for (var node in this.state.adjList) {
            var neighborlist = [];
            for (var i = 0; i < this.state.adjList[node].length; i += 1) {
                neighborlist.push(this.state.adjList[node][i]);
            }
            neighborlist = neighborlist.toString();
            JSXadjList.push(<li className="listitems" key={node} style={{ margin: "13px", minWidth: "110px", letterSpacing: "2px" }}>{node}:{neighborlist}</li>);
        }
        return JSXadjList;
    }

    showBridges = () => {
        var lines = this.state.lines;
        for (var i = 0; i < lines.length; i += 1) {
            if (this.state.undirected === true) {
                var key = lines[i].startid.toString() + "," + lines[i].endid.toString();
                var keyrev = lines[i].endid.toString() + "," + lines[i].startid.toString();
                if (key in this.state.bridgeDict || keyrev in this.state.bridgeDict) {
                    lines[i].fill = 'red';
                } else {
                    lines[i].fill = 'black';
                }
            } else {
                lines[i].fill = 'black';
            }
        }
        this.setState({
            lines: lines
        })
    }

    render() {
        var topologicalordering = this.topologicalSort();
        topologicalordering.slice(-1)
        if (topologicalordering.length < 1 && this.state.canvas.length > 0) {
            topologicalordering = "Cycle Detected!"
        }
        var JSXadjList = this.createntries();
        var usefultext = (this.state.isBipartite ? "Bipartite: True\n" : "Bipartite: False\n") +
            ("Components: " + (this.state.undirected ? this.state.numComponents : "N/A") + "\n") +
            ("V: " + (this.state.canvas.length) + "\n") +
            ("E: " + (this.state.lines.length + this.state.loops.length));
        return (
            <div>
                <div style={{ display: "flex", flexDirection: "row", boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px", justifyContent: "space-between" }}>
                    <h1 className="titletext">Graph Sketcher</h1>
                    <div style={{ display: "flex", flexDirection: "row", marginRight: "5rem" }}>
                        {
                            this.state.undirected === true ?
                                <p className='checktext'>Show Bridges <input type="checkbox" readOnly={true} className='checkbox' checked={this.state.showBridges === true ? true : false} onClick={() => this.setState((prevState) => ({ showBridges: !prevState.showBridges }), () => this.genAdjlist())}></input></p>
                                :
                                null
                        }
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <button className="optionsbuttons left" style={this.state.delete === false && this.state.color == false ? { backgroundColor: "#272942" } : { backgroundColor: "#4a508b" }} onClick={() => this.setState({ delete: false, color: false })}>DRAW</button>
                            <button className="optionsbuttons" style={this.state.delete === true ? { backgroundColor: "#272942" } : { backgroundColor: "#4a508b" }} onClick={() => this.setState({ delete: true, color: false })}>DELETE</button>
                            <button className="optionsbuttons right" style={this.state.delete === false && this.state.color == true ? { backgroundColor: "#272942" } : { backgroundColor: "#4a508b" }} onClick={() => this.setState({ color: true, delete: false })}>COLOR</button>
                        </div>
                        &nbsp;
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <button className="optionsbuttons left" style={this.state.undirected ? { backgroundColor: "#272942" } : { backgroundColor: "#4a508b" }} onClick={() => this.changeUndirected(true)}>UNDIRECTED</button>
                            <button className="optionsbuttons right" style={this.state.undirected ? { backgroundColor: "#4a508b" } : { backgroundColor: "#272942" }} onClick={() => this.changeUndirected(false)}>DIRECTED</button>
                        </div>
                    </div>
                </div>
                <div >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <ul className="adjListContainer" style={{ height: "100%", padding: "0px", margin: "0px", textAlign: "left", boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px", listStyleType: "none" }}>
                                {JSXadjList}
                            </ul>
                            {
                                this.state.undirected === false ?
                                    <p className="topo" style={{ boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px" }}>Topological Ordering: {topologicalordering}</p>
                                    :
                                    null
                            }
                        </div>
                        <Stage width={window.innerWidth - 20} height={window.innerHeight + 400} onClick={this.handleClick} ref={stageRef} style={{ left: 0, position: "absolute" }}  >
                            <Layer>
                                {this.state.loops.map(({ id, x, y, width, height, nodeid }, key) => ( // like a "for loop", this maps over this.state.canvas objects and pulls out the height, width, x, y properties to be used below
                                    // loop edges will be circles rotated around offset
                                    <Ellipse
                                        id={"loop" + nodeid}
                                        nodeid={nodeid}
                                        key={key}
                                        x={x}
                                        y={y}
                                        radiusX={width}
                                        radiusY={height}
                                        stroke='black'
                                        strokeWidth={3}
                                        onClick={this.deleteLoop}
                                    />
                                ))}
                                {this.state.lines.map(({ points, startid, endid, isgrouped, groupnumber, id, fill }, key) => ( // like a "for loop", this maps over this.state.canvas objects and pulls out the height, width, x, y properties to be used below
                                    this.state.undirected ?
                                        <Line
                                            id={"line" + id}
                                            key={key}
                                            startid={startid}
                                            endid={endid}
                                            points={points}
                                            stroke={fill}
                                            strokeWidth={4}
                                            isgrouped={isgrouped}
                                            groupnumber={groupnumber}
                                            name="line"
                                            onClick={this.deleteLine}
                                        />
                                        :
                                        <Arrow
                                            id={"line" + id}
                                            key={key}
                                            startid={startid}
                                            endid={endid}
                                            points={points}
                                            stroke={fill}
                                            strokeWidth={4}
                                            isgrouped={isgrouped}
                                            groupnumber={groupnumber}
                                            name="line"
                                            pointerWidth={7}
                                            fill="black"
                                            onClick={this.deleteLine}
                                        />
                                ))}
                                {this.state.canvas.map(({ height, width, x, y, id, fill }, key) => (
                                    // loop edges will be circles rotated around offset
                                    <Circle
                                        id={id.toString()}
                                        key={key}
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        stroke="black"
                                        strokeWidth={3}
                                        draggable='true'
                                        fill={fill}
                                        onDragStart={this.handleDragStart}
                                        onDragMove={this.updateLine}
                                        onDragEnd={this.handleDragEnd}
                                        onClick={this.addEdge}
                                        name="node"
                                    />
                                ))}
                                {this.state.canvas.map(({ height, width, x, y, id, fill }, key) => (
                                    <Text
                                        id={"label" + id} // label corresponds to node id
                                        x={id > 9 ? x - 9 : x - 4}
                                        y={y - 5}
                                        fontFamily='Lato, sans-serif'
                                        fontStyle="bold"
                                        fontSize={15}
                                        text={id.toString()}
                                        listening={false}
                                    />
                                ))}
                            </Layer>
                            <Layer>
                                <Group draggable={true}>
                                    <Rect
                                        x={window.innerWidth - 299}
                                        y={35}
                                        width={200}
                                        height={100}
                                        fill="white"
                                        shadowBlur={15}
                                        shadowOpacity={.5}
                                        shadowOffsetX={6}
                                        shadowOffsetY={6}
                                        cornerRadius={7}

                                    />
                                    <Text
                                        x={window.innerWidth - 299}
                                        y={40}
                                        fontFamily='Lato, sans-serif'
                                        fontSize={18}
                                        fontStyle="bold"
                                        text={usefultext}
                                        align='center'
                                        lineHeight={1.3}
                                        width={200}
                                    />
                                </Group>
                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>
        );
    }
}