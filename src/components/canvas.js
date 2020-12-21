import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";

// creates a random number between 1 and a number parameter passed in as "num"
const random = num => Math.floor(Math.random() * num) + 1;
var counter = 1;
var linecounter = 1;
// creates a new object with random: x, y, width, and height values (the number passed in represents a maximum value)
const newRectangle = (pos) => (
    {
        id: counter,
        x: pos.x,
        y: pos.y,
        width: 40,
        height: 40
    });
const stageRef = React.createRef();
export default class MainCanvas extends Component {


    state = {
        isBipartite: true,
        canvas: [],
        lines: [],
        adjList: {},
        edgenodestart: [null, null, null]
    };

    handleClick = (e) => {

        const emptySpace = e.target === e.target.getStage();
        if (!emptySpace) {
            return;
        }
        const pos = e.target.getStage().getPointerPosition();
        this.setState(prevState => ({
            canvas: [...prevState.canvas, { ...newRectangle(pos) }],

        }));
        counter += 1;
    };

    handleDragStart = e => {
        e.target.to({
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 10,
            shadowColor: "black",
            scaleX: 1.15,
            scaleY: 1.15
        });
    };

    handleDragEnd = e => {
        e.target.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: 1,
            scaleY: 1,
            shadowBlur: 0,
        });
    };
    addEdge = (e) => {

        //console.log(this.state.adjlist);
        if (this.state.edgenodestart[0] == null) {
            this.setState({
                edgenodestart: [e.target.attrs.id, e.target.attrs.x, e.target.attrs.y]
            })

        } else {
            var flag = 0;
            var nodestart = this.state.edgenodestart[0];
            var nodestartx = this.state.edgenodestart[1];
            var nodestarty = this.state.edgenodestart[2];
            var nodeend = e.target.attrs.id;
            var nodeendx = e.target.attrs.x;
            var nodeendy = e.target.attrs.y;
            var layer = stageRef.current;
            var lines = layer.find('#line');
            var numlines = 0;
            var i = 0
            var lastindex = 0;
            for (i = 0; i < lines.length; i += 1) {
                if ((lines[i].attrs.startid === nodestart && lines[i].attrs.endid === nodeend) || (lines[i].attrs.startid === nodeend && lines[i].attrs.endid === nodestart)) {

                    flag = 1;
                    numlines += 1;
                    lastindex = i;

                }
            }
            //console.log(numlines);
            const radius = 20;
            let angle = 0;
            var flag = 0;
            if (nodestartx >= nodeendx) {
                flag = 1;
            }
            const dx = nodestartx - nodeendx;
            const dy = nodestarty - nodeendy;
            angle = Math.atan2(-dy, dx);
            if (numlines === 1) {
                if (flag != 1) {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - 1) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - 1) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle + 1) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle + 1) * .5);
                } else {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + 1) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + 1) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle - 1) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle - 1) * .5);
                }
            }
            else if (numlines === 2) {

                if (flag != 1) {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + 1) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + 1) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle - 1) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle - 1) * .5);
                } else {
                    nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - 1) * .5);
                    nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - 1) * .5);
                    nodeendx = nodeendx + -radius * (Math.cos(angle + 1) * .5);
                    nodeendy = nodeendy + radius * (Math.sin(angle + 1) * .5);
                };
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
                groupnumber: groupnumber
            }
            this.setState(prevState => ({
                lines: [...prevState.lines, { ...newline }]
            }));
            this.setState({
                edgenodestart: [null, null, null]
            })
            linecounter += 1;
            this.genAdjlist(linecounter, true);//currently undirected graph

        }

    }
    updateLine = (e) => {
        var nodeid = e.target.attrs.id;
        var layer = stageRef.current;
        var lines = layer.find('#line');

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
                const radius = 20;
                const dx = nodestartx - nodeendx;
                const dy = nodestarty - nodeendy;
                let angle = Math.atan2(-dy, dx);
                if (lines[i].attrs.groupnumber % 3 === 1 || lines[i].attrs.isgrouped === false) {
                    var curpoints = lines[i].attrs.points
                    curpoints[0] = e.target.attrs.x;
                    curpoints[1] = e.target.attrs.y;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber % 3 === 2) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + 1) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - 1) * .5);
                    }

                    var curpoints = lines[i].attrs.points
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber % 3 === 0) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - 1) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + 1) * .5);
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
                const radius = 20;
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

                if (lines[i].attrs.groupnumber % 3 === 1 || lines[i].attrs.isgrouped === false) {
                    var curpoints = lines[i].attrs.points
                    curpoints[2] = e.target.attrs.x;
                    curpoints[3] = e.target.attrs.y;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber % 3 === 2) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + 1) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - 1) * .5);
                    }
                    var curpoints = lines[i].attrs.points
                    curpoints[0] = nodestartx;
                    curpoints[1] = nodestarty;
                    curpoints[2] = nodeendx;
                    curpoints[3] = nodeendy;
                    lines[i].attrs.points = curpoints;
                }
                else if (lines[i].attrs.groupnumber % 3 === 0) {
                    if (flag != 1) {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI + 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI + 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle - 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle - 1) * .5);
                    } else {
                        nodestartx = nodestartx + -radius * (Math.cos(angle + Math.PI - 1) * .5);
                        nodestarty = nodestarty + radius * (Math.sin(angle + Math.PI - 1) * .5);
                        nodeendx = nodeendx + -radius * (Math.cos(angle + 1) * .5);
                        nodeendy = nodeendy + radius * (Math.sin(angle + 1) * .5);
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

    }
    genAdjlist = (newline, isundirected) => {
        var layer = stageRef.current;
        var lines = layer.find('#line');
        var adjList = {};
        var flag = false;
        for (var i = 0; i < lines.length; i += 1) {
            if (isundirected === true) {
                // for undirected parallel edges will never add a new edge, makes sure that if we have 5,4 we know 5 is adjacent from 4
                var startend = [lines[i].attrs.startid, lines[i].attrs.endid].sort();
            } else {
                var startend = [lines[i].attrs.startid, lines[i].attrs.endid];
            }

            if (adjList[startend[0]] != null) {
                var newDict = adjList[startend[0]];
                if (newDict[startend[1]] != null) {
                    newDict[startend[1]] += 1;
                } else {
                    newDict[startend[1]] = 1;
                    adjList[startend[0]] = newDict;
                }

            } else {
                var myDict = {}
                myDict[startend[1]] = 1;
                adjList[startend[0]] = myDict;
            }
        }
        //console.log(adjList);
        this.setState({ adjList: adjList }, () =>
            this.isBipartite()
        );
    }
    isBipartite = () => {

        var isBipartite = true;
        if (this.state.lines.length === 0) {
            //console.log(this.state.isBipartite);
        } else {
            let colors = {}; // will store the color of each node with false and 2 true
            for (const adjDict in this.state.adjList) {
                if (adjDict in colors === false) {// only do bfs on nodes that werent visited
                    var queue = [] // queue for breadth first search
                    queue.push([adjDict, false]);
                    colors[adjDict] = false;
                    while (queue.length > 0) {
                        var curnode = queue.shift();// pop first node by shifting array
                        for (const adjNode in this.state.adjList[curnode[0]]) {
                            if (adjNode in colors === true && colors[adjNode] === curnode[1]) {
                                isBipartite = false;
                                break;
                            }

                            colors[adjNode] = !curnode[1];
                            queue.push([adjNode, !curnode[1]]);
                        }
                        for (const adjDict in this.state.adjList) { // get any other nodes since undirected
                            if (curnode[0] in this.state.adjList[adjDict] === true && adjDict in colors != true) {
                                colors[adjDict] = !curnode[1];
                                queue.push([adjDict, !curnode[1]]);
                            }
                        }
                    }
                }
            }
        }
        this.setState({
            isBipartite: isBipartite
        });

    }

    render = () => (
        <div >
            {
                this.state.isBipartite ?
                    <p>Bipartite: True</p>
                    :
                    <p>Bipartite: False</p>
            }

            <Stage width={window.innerWidth} height={window.innerHeight} onClick={this.handleClick} ref={stageRef}  >

                <Layer>

                    {this.state.lines.map(({ points, startid, endid, isgrouped, groupnumber }, key) => ( // like a "for loop", this maps over this.state.canvas objects and pulls out the height, width, x, y properties to be used below
                        <Line
                            id="line"
                            key={key}
                            startid={startid}
                            endid={endid}
                            points={points}
                            stroke='black'
                            strokeWidth={3}
                            isgrouped={isgrouped}
                            groupnumber={groupnumber}
                        />
                    ))}

                    {this.state.canvas.map(({ height, width, x, y, id }, key) => (
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
                            fill="white"

                            onDragStart={this.handleDragStart}
                            onDragMove={this.updateLine}
                            onDragEnd={this.handleDragEnd}
                            onClick={this.addEdge}
                        />
                    ))}

                </Layer>
            </Stage>
        </div>

    );
}