var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MazeApp;
(function (MazeApp) {
    var Dashboard = (function () {
        function Dashboard(model) {
            this.tableBody = model.tableBody;
            this.buildTheTable(model.data);
        }
        Dashboard.prototype.buildTheTable = function (data) {
            for (var i = 0; i < data.length; i++) {
                var row = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                var td3 = document.createElement("td");
                var mazeLink = document.createElement("a");
                td1.innerText = this.parseDate(data[i].RaceDate);
                td2.innerText = data[i].CompletionTime;
                $(mazeLink)
                    .attr("href", this.buildMazeLink(data[i].MazeId))
                    .text("Maze " + data[i].MazeId);
                $(td3).append($(mazeLink));
                row.appendChild(td1);
                row.appendChild(td2);
                row.appendChild(td3);
                this.tableBody.append($(row));
            }
        };
        Dashboard.prototype.buildMazeLink = function (mazeId) {
            return window.location.href
                .replace("Dashboard", "Race/")
                .concat("?id=" + mazeId);
        };
        Dashboard.prototype.parseDate = function (unParsedDate) {
            var cleanString = unParsedDate
                .replace("Date(", "").replace(/\/+/, "").replace(/\)\/+/, "");
            var dateAsNumber = parseInt(cleanString);
            var prettyDate = new Date(dateAsNumber);
            return prettyDate.toLocaleDateString();
        };
        return Dashboard;
    }());
    MazeApp.Dashboard = Dashboard;
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    var MazeAppController = (function () {
        function MazeAppController() {
        }
        return MazeAppController;
    }());
    MazeApp.MazeAppController = MazeAppController;
})(MazeApp || (MazeApp = {}));
document.addEventListener("DOMContentLoaded", function () {
    var app = new MazeApp.MazeAppController();
});
var UserOperationsHelper = (function () {
    function UserOperationsHelper(model) {
        this.signInUrl = model.signInUrl;
        this.signUpUrl = model.signUpUrl;
        this.setupBindings(model);
    }
    UserOperationsHelper.prototype.signUpNewUser = function (userModel) {
        var _this = this;
        var callback = $.ajax({
            type: "POST",
            url: _this.signUpUrl,
            data: userModel,
            success: function (response) {
                _this.printResult(response, "[USER CREATION]");
                alert("success");
            }
        });
        callback.always(function (response) {
            _this.printResult(response, "[USER CREATION]");
        });
    };
    UserOperationsHelper.prototype.signInExistingUser = function (data) {
        var _this = this;
        var promise = $.ajax({
            type: "POST",
            url: this.signInUrl,
            data: data
        });
        promise.done(function (response) {
            _this.printResult(response, "[Sign In Existing User]");
        });
    };
    UserOperationsHelper.prototype.printResult = function (response, operationType) {
        console.log("\nResponse Content From Operation: " + operationType);
        console.log("\n   Status --> " + response.status);
        console.log("\n  Message --> " + response.message);
        console.log("\n     Data -->  " + response.data);
    };
    UserOperationsHelper.prototype.setupBindings = function (urls) {
        var _this = this;
        $("#signin").submit(function (e) {
            e.preventDefault();
            var loginData = {
                Email: $("#user-email").val(),
                Password: $("#user-password").val()
            };
            _this.signInExistingUser(loginData);
        });
        $("#signup").submit(function (e) {
            e.preventDefault();
            var signUpData = {
                Name: $("#new-user-name").val(),
                Email: $("#new-user-email").val(),
                Password: $("#new-user-password").val()
            };
            _this.signUpNewUser(signUpData);
        });
    };
    return UserOperationsHelper;
}());
var MazeApp;
(function (MazeApp) {
    var CompressionHandler = (function () {
        function CompressionHandler(maze) {
            this.shareLink = "";
            if (maze != null) {
                this.maze = maze;
                this.ensureNodesHavePathDirections(this.maze);
                this.hex = this.exportNodesAsHex(this.maze);
                this.shareLink = this.constructUrlFromCurrentMazeData();
                history.pushState(null, null, this.shareLink);
            }
            else {
                this.updateBundleWithUrlData();
            }
        }
        CompressionHandler.prototype.exportNodesAsHex = function (maze) {
            var hx = "";
            var nodeKeys = Object.keys(maze.nodes).sort();
            for (var i = 0; i < nodeKeys.length - 1; i += 2) {
                var binary = "";
                var node1Paths = maze.nodes[nodeKeys[i]].pathDirections;
                var node2Paths = maze.nodes[nodeKeys[i + 1]].pathDirections;
                binary += node1Paths.indexOf(MazeApp.Direction.Right) > -1 ? "1" : "0";
                binary += node1Paths.indexOf(MazeApp.Direction.Down) > -1 ? "1" : "0";
                binary += node2Paths.indexOf(MazeApp.Direction.Right) > -1 ? "1" : "0";
                binary += node2Paths.indexOf(MazeApp.Direction.Down) > -1 ? "1" : "0";
                var numberVal = parseInt(binary, 2);
                hx += MazeApp.getHexFromDecimalString(numberVal);
            }
            return hx;
        };
        CompressionHandler.prototype.constructUrlFromCurrentMazeData = function () {
            return window.location.href.split("?")[0] +
                "?" +
                ("n=" + this.hex + "&") +
                ("c=" + this.maze.cols + "&") +
                ("r=" + this.maze.rows + "&") +
                ("l=" + this.maze.currentLevel);
        };
        CompressionHandler.prototype.updateBundleWithUrlData = function () {
            var urlParams = "";
            if (window.location.href.indexOf("?") > -1) {
                urlParams = window.location.href.split("?")[1];
            }
            var data = urlParams.split("&");
            for (var i = 0; i < data.length; i++) {
                var dataParts = data[i].split("=");
                var type = dataParts[0], content = dataParts[1];
                if (type === "n") {
                    this.hex = content;
                }
                else if (type === "c") {
                    this.cols = +content;
                }
                else if (type === "r") {
                    this.rows = +content;
                }
                else if (type === "l") {
                    this.level = +content;
                }
            }
            if (this.level == null) {
                this.level = 1;
            }
            this.bundle = {
                hexstring: this.hex,
                cols: this.cols,
                rows: this.rows,
                level: this.level,
            };
        };
        CompressionHandler.prototype.getMazeBundle = function () {
            if (this.bundle == null) {
                this.updateBundleWithUrlData();
            }
            return this.bundle;
        };
        CompressionHandler.prototype.ensureNodesHavePathDirections = function (maze) {
            var nodeKeys = Object.keys(maze.nodes).sort();
            for (var _i = 0, nodeKeys_1 = nodeKeys; _i < nodeKeys_1.length; _i++) {
                var n = nodeKeys_1[_i];
                maze.nodes[n].transformSiblingKeysToDirections();
            }
        };
        return CompressionHandler;
    }());
    MazeApp.CompressionHandler = CompressionHandler;
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    var currentLevel = 1;
    var privateLevel = null;
    MazeApp.defaultLineSpacing = function () {
        var type = MazeApp.detectDeviceType();
        if (type === DeviceType.Desktop) {
            return 50;
        }
        else {
            return 80;
        }
    };
    MazeApp.controlSpeed = function () {
        return 50;
    };
    MazeApp.goHomeSpeed = function () {
        return 500;
    };
    var DeviceType;
    (function (DeviceType) {
        DeviceType[DeviceType["Mobile"] = 0] = "Mobile";
        DeviceType[DeviceType["Desktop"] = 1] = "Desktop";
        DeviceType[DeviceType["Tablet"] = 2] = "Tablet";
    })(DeviceType = MazeApp.DeviceType || (MazeApp.DeviceType = {}));
    var deviceTypes = [DeviceType.Mobile, DeviceType.Desktop, DeviceType.Tablet];
    var Direction;
    (function (Direction) {
        Direction[Direction["Up"] = 0] = "Up";
        Direction[Direction["Right"] = 1] = "Right";
        Direction[Direction["Down"] = 2] = "Down";
        Direction[Direction["Left"] = 3] = "Left";
    })(Direction = MazeApp.Direction || (MazeApp.Direction = {}));
    var directions = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];
    MazeApp.levelSpeed = {
        One: 400,
        Two: 420,
        Three: 440,
        Four: 450,
        Five: 500,
        Six: 510,
        Seven: 520,
        Eight: 600,
        Nine: 700,
        Ten: 800
    };
    MazeApp.aINodeSpeed = {
        "1": 140,
        "2": 120,
        "3": 100,
        "4": 95,
        "5": 90,
        "6": 85,
        "7": 75,
        "8": 65,
        "9": 55,
        "10": 45
    };
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    function detectDeviceType() {
        var type;
        if ("ontouchstart" in document && $(window).width() < 1500) {
            type = MazeApp.DeviceType.Mobile;
        }
        else {
            type = MazeApp.DeviceType.Desktop;
        }
        return type;
    }
    MazeApp.detectDeviceType = detectDeviceType;
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    MazeApp.shuffle = shuffle;
    ;
    function transformHexToDirection(input) {
        switch (input) {
            case "0": return ["0", "0", "0", "0"];
            case "1": return ["0", "0", "0", "1"];
            case "2": return ["0", "0", "1", "0"];
            case "3": return ["0", "0", "1", "1"];
            case "4": return ["0", "1", "0", "0"];
            case "5": return ["0", "1", "0", "1"];
            case "6": return ["0", "1", "1", "0"];
            case "7": return ["0", "1", "1", "1"];
            case "8": return ["1", "0", "0", "0"];
            case "9": return ["1", "0", "0", "1"];
            case "a": return ["1", "0", "1", "0"];
            case "b": return ["1", "0", "1", "1"];
            case "c": return ["1", "1", "0", "0"];
            case "d": return ["1", "1", "0", "1"];
            case "e": return ["1", "1", "1", "0"];
            case "f": return ["1", "1", "1", "1"];
            default: return ["-1", "-1", "-1", "-1"];
        }
    }
    MazeApp.transformHexToDirection = transformHexToDirection;
    function getOrthogonalKey(x1, y1, x2, y2) {
        var wX1;
        var wY1;
        var wX2;
        var wY2;
        if (x1 === x2) {
            var high = y2 > y1 ? y2 : y1;
            var low = y2 !== high ? y2 : y1;
            var dX = Math.round((high - low) / 2);
            wY1 = wY2 = high - dX;
            wX1 = x1 - dX;
            wX2 = x1 + dX;
        }
        else {
            var high = x2 > x1 ? x2 : x1;
            var low = x2 !== high ? x2 : x1;
            var dX = Math.round((high - low) / 2);
            wX1 = wX2 = high - dX;
            wY1 = y1 - dX;
            wY2 = y1 + dX;
        }
        return wX1 + "." + wY1 + "." + wX2 + "." + wY2;
    }
    MazeApp.getOrthogonalKey = getOrthogonalKey;
    function getHexFromDecimalString(input) {
        switch (input) {
            case 10: return "a";
            case 11: return "b";
            case 12: return "c";
            case 13: return "d";
            case 14: return "e";
            case 15: return "f";
            default: return input.toString();
        }
    }
    MazeApp.getHexFromDecimalString = getHexFromDecimalString;
    function getVelocityFromLevel(level) {
        switch (level) {
            case 0: return MazeApp.levelSpeed.One;
            case 1: return MazeApp.levelSpeed.One;
            case 2: return MazeApp.levelSpeed.Two;
            case 3: return MazeApp.levelSpeed.Three;
            case 4: return MazeApp.levelSpeed.Four;
            case 5: return MazeApp.levelSpeed.Five;
            case 6: return MazeApp.levelSpeed.Six;
            case 7: return MazeApp.levelSpeed.Seven;
            case 8: return MazeApp.levelSpeed.Eight;
            case 9: return MazeApp.levelSpeed.Nine;
            case 10: return MazeApp.levelSpeed.Ten;
            default: return -1;
        }
    }
    MazeApp.getVelocityFromLevel = getVelocityFromLevel;
    function toggleColors(count, level) {
        if (count === 0) {
            $(".level-defeated-msg").text("You defeated level: " + (level - 1));
            $("#mz-svg").hide();
            $(".control-zone").hide();
            $("#msg-container").css({
                "height": "100%",
                "display": "block",
                "padding": "75px 25px"
            });
            var url_1 = window.location.href;
            $("#msg-container").click(function () {
                document.location.href = url_1.split("?")[0] + "?l=" + level;
            });
            window.setTimeout(function () {
                document.location.href = url_1.split("?")[0] + "?l=" + level;
            }, 3000);
        }
        else {
            var newcount_1 = count - 1;
            if (newcount_1 > 0) {
                window.setTimeout(function () {
                    $(".green, .magenta").toggleClass("green").toggleClass("magenta");
                    toggleColors(newcount_1, level);
                }, 100);
            }
            else {
                toggleColors(newcount_1, level);
            }
        }
    }
    MazeApp.toggleColors = toggleColors;
    ;
    function handleMazeCompletion(count, level) {
        count = count == null ? 0 : count;
        toggleColors(count, level);
    }
    MazeApp.handleMazeCompletion = handleMazeCompletion;
    ;
    function setTimingMarks(mazeGraph) {
        mazeGraph.raceTime1 = performance.now();
    }
    MazeApp.setTimingMarks = setTimingMarks;
    function getRaceCompletionTime(mazeGraph) {
        if (mazeGraph.raceTime === null) {
            return -1;
        }
        mazeGraph.raceTime2 = performance.now();
        var duration = mazeGraph.raceTime2 - mazeGraph.raceTime1;
        var secs = duration / 1000;
        var rounded = Math.round(secs * 100) / 100;
        return rounded;
    }
    MazeApp.getRaceCompletionTime = getRaceCompletionTime;
    function showEnding(node, mazeGraph) {
        alert("that took: " + getRaceCompletionTime(mazeGraph));
        node.fadeOutSafely();
        incrementLevel(mazeGraph);
        sendControlNodeHome(mazeGraph, true);
        var walls = $(".mz-wall.wall-active, .border-wall");
        walls.each(function (i) {
            if (i % 2 === 0) {
                $(walls[i]).addClass("green");
            }
            else {
                $(walls[i]).addClass("magenta");
            }
        });
        handleMazeCompletion(15, mazeGraph.currentLevel);
    }
    MazeApp.showEnding = showEnding;
    ;
    function goToYourHome(node) {
        node.svgJq.velocity({
            cx: node.home[0],
            cy: node.home[1]
        }, {
            duration: node.speed,
            easing: "spring",
            complete: function () {
                node.coolDown = false;
                node.cx = node.home[0];
                node.cy = node.home[1];
                node.coolDown = false;
                node.svgJq
                    .attr("cx", node.home[0])
                    .attr("cy", node.home[1])
                    .removeAttr("style");
                node.svgJq.velocity("stop", true);
            }
        });
    }
    MazeApp.goToYourHome = goToYourHome;
    ;
    function sendControlNodeHome(maze, stop) {
        var jqNode = maze.controlNode.svgJq;
        var cntrlNode = maze.controlNode;
        $("circle.control-node").velocity({
            cx: cntrlNode.home[0],
            cy: cntrlNode.home[1]
        }, {
            duration: MazeApp.goHomeSpeed(),
            easing: "linear",
            complete: function () {
                cntrlNode.coolDown = false;
                cntrlNode.cx = cntrlNode.home[0];
                cntrlNode.cy = cntrlNode.home[1];
                cntrlNode.coolDown = false;
                jqNode
                    .attr("cx", cntrlNode.home[0])
                    .attr("cy", cntrlNode.home[1])
                    .removeAttr("style");
                $("circle.control-node").velocity("stop", true);
            }
        });
    }
    MazeApp.sendControlNodeHome = sendControlNodeHome;
    function incrementLevel(maze) {
        var urlArray = window.location.href.split("&");
        maze.currentLevel += 1;
        urlArray[3] = "l=" + maze.currentLevel;
        history.pushState(null, null, urlArray[0] + "&" + urlArray[1] + "&" + urlArray[2] + "&" + urlArray[3]);
        var newLevelDisplay = "Level :: " + maze.currentLevel;
        $("#currentLevel-display").text(newLevelDisplay);
    }
    MazeApp.incrementLevel = incrementLevel;
})(MazeApp || (MazeApp = {}));
var MazeSearchers;
(function (MazeSearchers) {
    var Dfs = (function () {
        function Dfs(mazeGraph) {
            this.solutionPath = [];
            this.mazeGraph = mazeGraph;
        }
        Dfs.prototype.iterativeDfs = function (startNodeKey, endNodeKey) {
            var alias = this;
            var isSovable = false;
            var v = this.mazeGraph.nodes[startNodeKey];
            var stack = [];
            stack.push(v);
            while (stack.length > 0) {
                var w = stack.pop();
                this.visit(w);
                if (w.isEnd) {
                    isSovable = true;
                    break;
                }
                for (var i = 0; i < w.siblings.length; i++) {
                    var nextKey = w.siblings[i];
                    var sibling = alias.mazeGraph.nodes[nextKey];
                    if (!sibling.isVisited) {
                        stack.push(sibling);
                    }
                }
            }
            if (isSovable) {
                $("#path-found").show().fadeOut(5000);
            }
            else {
                $("#path-not-found").show().fadeOut(5000);
            }
            return isSovable;
        };
        Dfs.prototype.visit = function (node) {
            node.isVisited = true;
            if (!node.isEnd && !node.isStart) {
                $("#" + node.key).hide();
                node.svg
                    .setAttribute("class", "mz-node visited-node");
                $("#" + node.key).fadeIn(5000);
            }
        };
        Dfs.prototype.setUpRecursiveDfs = function (startNodeKey, endNodeKey) {
            var v = this.mazeGraph.nodes[startNodeKey];
            var stack = [];
            stack.push(v);
            var canSolve = this.recursiveDfs(startNodeKey, endNodeKey, stack);
            if (canSolve) {
                $("#path-found").fadeIn(500, function () {
                    $(this).fadeOut(500);
                });
            }
            else {
                $("#path-not-found").addClass("fa-spin").fadeIn(500, function () {
                    $(this).fadeOut(500);
                });
            }
        };
        Dfs.prototype.recursiveDfs = function (startNodeKey, endNodeKey, stack) {
            if (stack.length > 0) {
                var w = stack.pop();
                this.visit(w);
                if (w.isEnd) {
                    return true;
                }
                else {
                    for (var i = 0; i < w.siblings.length; i++) {
                        var nextKey = w.siblings[i];
                        var sibling = this.mazeGraph.nodes[nextKey];
                        if (!sibling.isVisited) {
                            stack.push(sibling);
                        }
                    }
                    return this.recursiveDfs(startNodeKey, endNodeKey, stack);
                }
            }
            return false;
        };
        return Dfs;
    }());
    MazeSearchers.Dfs = Dfs;
})(MazeSearchers || (MazeSearchers = {}));
var MazeSearchers;
(function (MazeSearchers) {
    var Dijskstra = (function () {
        function Dijskstra(maze) {
            this.maxdist = 999999;
            this.startNodeIndex = -1;
            this.solveNeeded = true;
            this.maze = maze;
            this.refreshData();
        }
        Dijskstra.prototype.refreshData = function () {
            this.q = [];
            this.minPathsToStart = {};
            var index = 0;
            this.maxQueSize = 0;
            var nodes = this.maze.nodes;
            for (var key in nodes) {
                if (nodes.hasOwnProperty(key)) {
                    var nextNode = nodes[key];
                    var dist = nextNode.isStart ? 0 : this.maxdist;
                    var isDest = false;
                    var distKnown = false;
                    var currIndex = -1;
                    var siblingKeys = [];
                    var minPathNeighbor = "unknown";
                    if (typeof (nextNode.siblings) != "undefined") {
                        if (nextNode.siblings != null) {
                            siblingKeys = nextNode.siblings;
                        }
                    }
                    if (nextNode.isStart) {
                        this.startKey = nextNode.key;
                        this.startNodeIndex = index;
                        dist = 0;
                        distKnown = true;
                        currIndex = 0;
                        minPathNeighbor = null;
                    }
                    else if (nextNode.isEnd) {
                        this.destKey = nextNode.key;
                        isDest = true;
                    }
                    this.q.push({
                        key: nextNode.key,
                        distFromStart: dist,
                        isDest: isDest,
                        distKnown: distKnown,
                        siblingKeys: siblingKeys,
                        currIndex: currIndex,
                        minPathNeighbor: minPathNeighbor,
                    });
                    index += 1;
                }
            }
            this.maxQueSize = index;
        };
        Dijskstra.prototype.translateToPath = function (minpathData) {
            var nodeArray = [];
            var nextNode = minpathData[this.destKey];
            while ((typeof (nextNode) != "undefined")) {
                nodeArray.push(nextNode.self);
                nextNode = minpathData[nextNode.from];
            }
            return nodeArray.reverse();
        };
        Dijskstra.prototype.run = function () {
            if (!this.solveNeeded) {
                return this.solution;
            }
            else {
                this.refreshData();
                var nodes = this.maze.nodes;
                for (var key in nodes) {
                    if (nodes.hasOwnProperty(key)) {
                        nodes[key].isVisited = false;
                    }
                }
                var solutionExists = this.runAlgorithm();
                if (solutionExists) {
                    this.solution = this.translateToPath(this.minPathsToStart);
                    this.solveNeeded = false;
                    return this.solution;
                }
                return null;
            }
        };
        Dijskstra.prototype.getIndexWithKey = function (searchKey, collection) {
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].key === searchKey) {
                    return i;
                }
            }
            return -1;
        };
        Dijskstra.prototype.runAlgorithm = function () {
            var start = this.q[this.startNodeIndex];
            var priorityQue = {};
            var paths = [];
            priorityQue[this.startKey] =
                {
                    key: this.startKey,
                    distFromStart: 0,
                    isDest: false,
                    distKnown: true,
                    siblingKeys: start.siblingKeys,
                    minPathNeighbor: null
                };
            var priorityNode = priorityQue[this.startKey];
            var destNodeFound = false;
            while (!priorityNode.isDest && paths.length < this.maxQueSize) {
                for (var i = 0; i < priorityNode.siblingKeys.length; i++) {
                    var sibKey = priorityNode.siblingKeys[i];
                    var sibling = priorityQue[sibKey];
                    if (typeof (sibling) == "undefined") {
                        var sibIndexInQ = this.getIndexWithKey(priorityNode.siblingKeys[i], this.q);
                        var ogSibling = this.q[sibIndexInQ];
                        priorityQue[priorityNode.siblingKeys[i]] =
                            {
                                key: priorityNode.siblingKeys[i],
                                distFromStart: priorityNode.distFromStart + 1,
                                isDest: this.q[sibIndexInQ].isDest,
                                distKnown: false,
                                siblingKeys: this.q[sibIndexInQ].siblingKeys,
                                minPathNeighbor: "uknown",
                            };
                        if (ogSibling.isDest) {
                            destNodeFound = true;
                        }
                        sibling = priorityQue[priorityNode.siblingKeys[i]];
                    }
                    if (sibling != null && sibling.key != this.startKey) {
                        if (typeof (sibling.distFromStart) == "undefined" || (sibling.distFromStart == null)) {
                            priorityQue[priorityNode.siblingKeys[i]]
                                .distFromStart = priorityNode.distFromStart + 1;
                        }
                        if (sibling.distFromStart > priorityNode.distFromStart + 1 ||
                            (sibling.distFromStart == null)) {
                            sibling.distFromStart = priorityNode.distFromStart + 1;
                        }
                    }
                }
                var lastPriorityNode = priorityNode;
                var isStart = priorityNode.key.toString() == this.startKey;
                priorityQue[lastPriorityNode.key] = null;
                var itemsInPriorityQue = 0;
                var min = this.maxdist;
                for (var key in priorityQue) {
                    if (priorityQue.hasOwnProperty(key)) {
                        itemsInPriorityQue += 1;
                        if (priorityQue[key] != null) {
                            if (priorityQue[key].distFromStart < min) {
                                min = priorityQue[key].distFromStart;
                                priorityNode = priorityQue[key];
                            }
                        }
                    }
                }
                if (itemsInPriorityQue === 0) {
                    return destNodeFound;
                }
                else {
                    var fromKey = "unknown";
                    if (priorityNode.siblingKeys.indexOf(lastPriorityNode.key) > -1) {
                        priorityNode.minPathNeighbor = lastPriorityNode.key;
                        fromKey = lastPriorityNode.key;
                    }
                    else {
                        priorityNode.minPathNeighbor = "unknown";
                        for (var i = paths.length - 1; i > -1; i--) {
                            var pathItem = paths[i].self;
                            if (priorityNode.siblingKeys.indexOf(pathItem) > -1) {
                                fromKey = pathItem;
                                priorityNode.minPathNeighbor = fromKey;
                                break;
                            }
                        }
                    }
                    var nextMinPathObject = {
                        start: isStart,
                        self: priorityNode.key,
                        from: fromKey,
                    };
                    this.minPathsToStart[priorityNode.key] = nextMinPathObject;
                    paths.push(nextMinPathObject);
                }
            }
            return destNodeFound;
        };
        Dijskstra.prototype.getSolutionData = function () {
            var minPath = this.translateToPath(this.minPathsToStart);
        };
        return Dijskstra;
    }());
    MazeSearchers.Dijskstra = Dijskstra;
})(MazeSearchers || (MazeSearchers = {}));
var MazeApp;
(function (MazeApp) {
    var ControlNode = (function () {
        function ControlNode(initParams) {
            this.home = [];
            this.speed = 40;
            this.coolDown = false;
            this.mazeHeight = 0;
            this.mazeWidth = 0;
            this.cx = initParams.cx;
            this.cy = initParams.cy;
            this.r = initParams.r;
            this.mazeGraph = initParams.maze;
            this.home[0] = this.cx;
            this.home[1] = this.cy;
            this.offSet = initParams.offset;
            this.mazeHeight = +this.mazeGraph.svg.attributes["height"].value;
            this.mazeWidth = +this.mazeGraph.svg.attributes["width"].value;
            if (!initParams.ai) {
                this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                this.svg.setAttribute("cx", this.cx.toString());
                this.svg.setAttribute("cy", this.cy.toString());
                this.svg.setAttribute("r", this.r.toString());
                this.svg.setAttribute("class", "mz-node control-node");
                this.svg.setAttribute("id", "controlnode");
                this.mazeGraph.svg.appendChild(this.svg);
                this.svgJq = $("circle.control-node");
                this.handleBindings();
            }
        }
        ControlNode.prototype.move = function (direction) {
            var _this = this;
            var newPos = this.getNewCoordinates(direction);
            if (!this.checkMove(newPos.x, newPos.y, direction))
                return false;
            var alias = this;
            this.svgJq.velocity({
                cx: newPos.x,
                cy: newPos.y
            }, {
                duration: this.speed,
                easing: "linear",
                complete: function () {
                    _this.coolDown = false;
                    _this.cx = newPos.x;
                    _this.cy = newPos.y;
                    _this.svg.setAttribute("cx", String(newPos.x));
                    _this.svg.setAttribute("cy", String(newPos.y));
                    var key = newPos.x + "." + newPos.y;
                    if (key === _this.mazeGraph.endKey && $("span.racemode-label").hasClass("magenta")) {
                        _this.mazeGraph.aiNode.keepRacing = false;
                        MazeApp.showEnding(_this.mazeGraph.aiNode, _this.mazeGraph);
                        return true;
                    }
                    if (_this.mazeGraph.nodes[key].siblings.length < 3) {
                        var goingToDirection = _this.nextDirection(direction, key);
                        return _this.move(goingToDirection);
                    }
                    return true;
                }
            });
            return false;
        };
        ControlNode.prototype.getNewCoordinates = function (direction) {
            var point = {
                x: this.cx,
                y: this.cy
            };
            switch (direction) {
                case MazeApp.Direction.Left:
                    point.x = this.cx - this.offSet;
                    break;
                case MazeApp.Direction.Right:
                    point.x = this.cx + this.offSet;
                    break;
                case MazeApp.Direction.Up:
                    point.y = this.cy - this.offSet;
                    break;
                case MazeApp.Direction.Down:
                    point.y = this.cy + this.offSet;
                    break;
                default: break;
            }
            return point;
        };
        ControlNode.prototype.checkMove = function (newXPos, newYPos, direction) {
            if (this.coolDown) {
                return false;
            }
            var currNode = this.mazeGraph.nodes[this.cx + "." + this.cy];
            var siblingAhead = currNode.siblings.indexOf(String(newXPos) + "." + String(newYPos)) > -1;
            if (!siblingAhead)
                return false;
            switch (direction) {
                case MazeApp.Direction.Left:
                    if (this.cx <= this.offSet)
                        return false;
                    break;
                case MazeApp.Direction.Right:
                    if (this.cx + this.offSet > $(this.mazeGraph.svg).width())
                        return false;
                    break;
                case MazeApp.Direction.Up:
                    if (this.cy <= this.offSet)
                        return false;
                    break;
                case MazeApp.Direction.Down:
                    if (this.cy + this.offSet > $(this.mazeGraph.svg).height())
                        return false;
                    break;
            }
            return this.coolDown = true;
        };
        ControlNode.prototype.handleBindings = function () {
            var _this = this;
            $(document.body).keydown(function (e) {
                switch (e.which) {
                    case 38:
                        _this.move(MazeApp.Direction.Up);
                        break;
                    case 40:
                        _this.move(MazeApp.Direction.Down);
                        break;
                    case 37:
                        _this.move(MazeApp.Direction.Left);
                        break;
                    case 39:
                        _this.move(MazeApp.Direction.Right);
                        break;
                    case 87:
                        _this.move(MazeApp.Direction.Up);
                        break;
                    case 83:
                        _this.move(MazeApp.Direction.Down);
                        break;
                    case 65:
                        _this.move(MazeApp.Direction.Left);
                        break;
                    case 68:
                        _this.move(MazeApp.Direction.Right);
                        break;
                    case 78:
                        $("#new-maze").trigger("click");
                        break;
                    case 82:
                        $("#racemode").trigger("click");
                        break;
                    default:
                        break;
                }
            });
            $(".mz-container").on({
                swipeleft: function () { _this.move(MazeApp.Direction.Left); },
                swiperight: function () { _this.move(MazeApp.Direction.Right); },
                swipeup: function () { _this.move(MazeApp.Direction.Up); },
                swipedown: function () { _this.move(MazeApp.Direction.Down); },
                ontouchstart: function (e) { e.preventDefault(); },
                ontouchmove: function (e) { e.preventDefault(); }
            });
            return this.mazeGraph;
        };
        ControlNode.prototype.nextDirection = function (oldDirection, key) {
            var oldX = this.cx;
            var oldY = this.cy;
            for (var _i = 0, _a = this.mazeGraph.nodes[key].siblings; _i < _a.length; _i++) {
                var siblingId = _a[_i];
                var split = siblingId.split(".");
                var newX = +split[0];
                var newY = +split[1];
                switch (oldDirection) {
                    case MazeApp.Direction.Up:
                        if (newY <= oldY) {
                            if (newY < oldY)
                                return MazeApp.Direction.Up;
                            if (newX < oldX)
                                return MazeApp.Direction.Left;
                            if (newX > oldX)
                                return MazeApp.Direction.Right;
                        }
                        break;
                    case MazeApp.Direction.Right:
                        if (newX >= oldX) {
                            if (newY < oldY)
                                return MazeApp.Direction.Up;
                            if (newY > oldY)
                                return MazeApp.Direction.Down;
                            if (newX > oldX)
                                return MazeApp.Direction.Right;
                        }
                        break;
                    case MazeApp.Direction.Down:
                        if (newY >= oldY) {
                            if (newY > oldY)
                                return MazeApp.Direction.Down;
                            if (newX < oldX)
                                return MazeApp.Direction.Left;
                            if (newX > oldX)
                                return MazeApp.Direction.Right;
                        }
                        break;
                    case MazeApp.Direction.Left:
                        if (newX <= oldX) {
                            if (newX < oldX)
                                return MazeApp.Direction.Left;
                            if (newY < oldY)
                                return MazeApp.Direction.Up;
                            if (newY > oldY)
                                return MazeApp.Direction.Down;
                        }
                        break;
                    default:
                        break;
                }
            }
        };
        return ControlNode;
    }());
    MazeApp.ControlNode = ControlNode;
    var ArtificialIntelligenceNode = (function (_super) {
        __extends(ArtificialIntelligenceNode, _super);
        function ArtificialIntelligenceNode(initParams) {
            var _this = _super.call(this, initParams) || this;
            _this.keepRacing = true;
            _this.speed = MazeApp.aINodeSpeed[_this.mazeGraph.currentLevel.toString()];
            _this.setUpSvg();
            return _this;
        }
        ArtificialIntelligenceNode.prototype.setSolutionNodeKeys = function (keys) {
            this.solutionNodeKeys = keys;
        };
        ArtificialIntelligenceNode.prototype.animateTowardsDestinationNode = function (positionNodes) {
            var _this = this;
            if (!this.keepRacing) {
                return true;
            }
            var nodeKey = positionNodes.shift().split(".");
            var xPos = +nodeKey[0];
            var yPos = +nodeKey[1];
            this.svgJq
                .velocity({
                cx: xPos,
                cy: yPos
            }, {
                queue: false,
                duration: this.speed,
                easing: "linear",
                complete: function () {
                    _this.coolDown = false;
                    _this.cx = xPos;
                    _this.cy = yPos;
                    _this.svg.setAttribute("cx", String(_this.cx));
                    _this.svg.setAttribute("cy", String(_this.cy));
                    if (positionNodes[0] === _this.mazeGraph.endKey) {
                        MazeApp.sendControlNodeHome(_this.mazeGraph, true);
                        _this.goHome(true);
                        return true;
                    }
                    else if (_this.keepRacing) {
                        return _this.animateTowardsDestinationNode(positionNodes);
                    }
                    else {
                        return true;
                    }
                }
            });
            return true;
        };
        ArtificialIntelligenceNode.prototype.kickOffRace = function () {
            var _this = this;
            var nodeArray = [];
            nodeArray = this.mazeGraph.solutionNodes.slice();
            if (this.keepRacing) {
                MazeApp.sendControlNodeHome(this.mazeGraph, true);
                setTimeout(function () {
                    _this.svgJq
                        .velocity({
                        opacity: 1
                    }, {
                        duration: MazeApp.goHomeSpeed(),
                        complete: function () {
                            _this.animateTowardsDestinationNode(nodeArray);
                        }
                    });
                }, MazeApp.goHomeSpeed());
            }
        };
        ArtificialIntelligenceNode.prototype.setUpSvg = function () {
            this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.svg.setAttribute("cx", this.cx.toString());
            this.svg.setAttribute("cy", this.cy.toString());
            this.svg.setAttribute("r", this.r.toString());
            this.svg.setAttribute("class", "mz-node ai-node");
            this.svg.setAttribute("id", "ainode");
            this.mazeGraph.svg.appendChild(this.svg);
            this.svgJq = $("circle.ai-node");
        };
        ArtificialIntelligenceNode.prototype.fadeOutSafely = function () {
            this.svgJq.velocity({ opacity: 0 }, { duration: 0 });
        };
        ArtificialIntelligenceNode.prototype.goHome = function (beginNewRace) {
            var _this = this;
            this.svgJq
                .velocity("stop", false)
                .velocity({
                cx: this.home[0],
                cy: this.home[1]
            }, {
                duration: MazeApp.goHomeSpeed(),
                easing: "linear",
                complete: function () {
                    _a = _this.home, _this.cx = _a[0], _this.cy = _a[1];
                    _this.svg.setAttribute("cx", String(_this.home[0]));
                    _this.svg.setAttribute("cy", String(_this.home[1]));
                    if (beginNewRace && _this.keepRacing) {
                        MazeApp.sendControlNodeHome(_this.mazeGraph, true);
                        _this.kickOffRace();
                        return true;
                    }
                    else {
                        _this.svgJq.velocity({ opacity: 0 }, { duration: MazeApp.goHomeSpeed() });
                        return true;
                    }
                    var _a;
                }
            });
            return true;
        };
        return ArtificialIntelligenceNode;
    }(ControlNode));
    MazeApp.ArtificialIntelligenceNode = ArtificialIntelligenceNode;
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    var MazeGraph = (function () {
        function MazeGraph(spacing, bundle, level) {
            this.nodes = {};
            this.paths = {};
            this.wallsInactive = {};
            this.wallsActive = {};
            this.solutionNodes = null;
            this.solutionPathTimeOut = null;
            this.container = $("#svg-container");
            this.currentLevel = level == null ? 1 : level;
            if (bundle == null) {
                this.spacing = spacing == null ? MazeApp.defaultLineSpacing() : spacing;
                this.scratchBuild();
            }
            else {
                this.bundleBuild(bundle);
            }
            this.mazeSolver = new MazeSearchers.Dijskstra(this);
        }
        MazeGraph.prototype.scratchBuild = function () {
            this.getMediaDimensions(false);
            this.createAndAppendSvgElement();
            this.setUpNodes();
            this.setUpPaths();
            this.setUpWalls();
        };
        MazeGraph.prototype.bundleBuild = function (bundle) {
            this.bundle = bundle;
            this.getMediaDimensions(true);
            this.createAndAppendSvgElement();
            this.setUpNodes();
            this.setupPathsWithBundle(bundle);
            this.setUpWalls();
        };
        MazeGraph.prototype.getMediaDimensions = function (bundle) {
            var defaultSpacing = MazeApp.defaultLineSpacing();
            var mzHeight = (Math.round(window.innerHeight - defaultSpacing));
            var mzWidth = (Math.round(window.innerWidth));
            $(".content").height(mzHeight);
            mzWidth -= defaultSpacing;
            if (bundle) {
                this.cols = this.bundle.cols;
                this.rows = this.bundle.rows;
                this.currentLevel = this.bundle.level;
                this.hexString = this.bundle.hexstring;
                var rqrdColSpacing = Math.round(mzWidth / this.cols);
                var rqrdRowSpacing = Math.round(mzHeight / this.rows);
                this.spacing = rqrdColSpacing >= rqrdRowSpacing ? rqrdColSpacing : rqrdRowSpacing;
                if (this.spacing > defaultSpacing) {
                    this.spacing = defaultSpacing;
                }
                while (this.spacing % 10 !== 0) {
                    this.spacing -= 1;
                }
            }
            else {
                this.cols = Math.floor(mzWidth / this.spacing) - 1;
                this.rows = Math.floor(mzHeight / this.spacing) - 1;
                this.cols = this.cols % 2 === 0 ? this.cols : this.cols - 1;
                this.rows = this.rows % 2 === 0 ? this.rows : this.rows - 1;
                this.currentLevel = this.currentLevel == null ? 1 : this.currentLevel;
            }
        };
        MazeGraph.prototype.setupPathsWithBundle = function (bundle) {
            var nodeCounter = 0;
            var keys = Object.keys(this.nodes).sort();
            for (var i = 0; i < bundle.hexstring.length; i++) {
                var key1 = keys[nodeCounter++];
                var key2 = keys[nodeCounter++];
                var nextHex = bundle.hexstring.charAt(i).toString();
                var nodes = this.getDirectionsWithDoubleCompressedHex(nextHex, key1, key2);
                for (var j = 0; j < nodes[0].siblings.length; j++) {
                    var nextSibKey = nodes[0].siblings[j];
                    if (nextSibKey != null) {
                        this.addPath(new MazeApp.MazePath(key1, nextSibKey));
                    }
                }
                for (var j = 0; j < nodes[1].siblings.length; j++) {
                    var nextSibKey = nodes[1].siblings[j];
                    if (nextSibKey != null) {
                        this.addPath(new MazeApp.MazePath(key2, nextSibKey));
                    }
                }
            }
        };
        MazeGraph.prototype.createAndAppendSvgElement = function () {
            this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            this.svg.setAttribute("width", (this.cols * this.spacing).toString());
            this.svg.setAttribute("height", (this.rows * this.spacing).toString());
            this.svg.setAttribute("id", "mz-svg");
            this.container.append(this.svg);
        };
        MazeGraph.prototype.setUpWalls = function () {
            var x1;
            var x2;
            var y1;
            var y2;
            for (var i = 1; i <= this.cols - 1; i++) {
                for (var j = 0; j < this.rows; j++) {
                    x1 = x2 = i * this.spacing;
                    y1 = j * this.spacing;
                    y2 = y1 + this.spacing;
                    this.addWall(new MazeApp.MazeWall(x1, y1, x2, y2, "mz-wall"));
                }
            }
            for (var i = 1; i <= this.rows - 1; i++) {
                for (var j = 0; j < this.cols; j++) {
                    y1 = y2 = i * this.spacing;
                    x1 = j * this.spacing;
                    x2 = x1 + this.spacing;
                    this.addWall(new MazeApp.MazeWall(x1, y1, x2, y2, "mz-wall"));
                }
            }
        };
        MazeGraph.prototype.setUpNodes = function () {
            var offset = this.spacing / 2;
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.rows; j++) {
                    var x = (i * this.spacing) + offset;
                    var y = (j * this.spacing) + offset;
                    this.nodes[x + "." + y] = new MazeApp.MazeNode(x, y, this.spacing);
                }
            }
            var startNode = this.nodes[Object.keys(this.nodes)[0]];
            startNode.setAsStartNode(this);
            var endNode = this.nodes[Object.keys(this.nodes)[Object.keys(this.nodes).length - 1]];
            endNode.setAsEndNode(this);
        };
        MazeGraph.prototype.setUpPaths = function () {
            var x1;
            var x2;
            var y1;
            var y2;
            var r = this.spacing;
            var r2 = Math.round(r / 2);
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.rows - 1; j++) {
                    x1 = x2 = i * r;
                    y1 = j * r;
                    y2 = y1 + r;
                    x1 += r2;
                    x2 += r2;
                    y1 += r2;
                    y2 += r2;
                    this.addPath(new MazeApp.MazePath(x1 + "." + y1, x2 + "." + y2));
                }
            }
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.cols - 1; j++) {
                    y1 = y2 = i * r;
                    x1 = j * r;
                    x2 = x1 + r;
                    x1 += r2;
                    x2 += r2;
                    y1 += r2;
                    y2 += r2;
                    this.addPath(new MazeApp.MazePath(x1 + "." + y1, x2 + "." + y2));
                }
            }
        };
        MazeGraph.prototype.addPath = function (path) {
            this.paths[path.id] = path;
            var node1 = this.nodes[path.mazeNodes[0]];
            var node2 = this.nodes[path.mazeNodes[1]];
            if (node1 != null && node2 != null) {
                if (node1.siblings.indexOf(node2.key) < 0) {
                    node1.siblings.push(node2.key);
                }
                if (node2.siblings.indexOf(node1.key) < 0) {
                    node2.siblings.push(node1.key);
                }
                return true;
            }
            return false;
        };
        MazeGraph.prototype.addWall = function (wall) {
            if (this.paths[wall.crossPath] != null) {
                this.wallsInactive[wall.id] = wall;
                this.svg.appendChild(wall.svg);
            }
            else {
                this.wallsActive[wall.id] = wall;
                wall.svg.setAttribute("class", "mz-wall wall-active");
                this.svg.appendChild(wall.svg);
            }
        };
        MazeGraph.prototype.activateInactiveWall = function (item) {
            var w = this.wallsInactive[item.id];
            this.wallsInactive[item.id] = null;
            this.wallsActive[item.id] = new MazeApp.MazeWall(w.x1, w.y1, w.x2, w.y2, "mz-wall wall-active");
            this.svg.appendChild(this.wallsActive[item.id].svg);
            this.removePathUsingWallKey(item.id);
        };
        MazeGraph.prototype.deactivateWallUsingWallKey = function (key) {
            var locations = key.split(".");
            var x1 = +locations[0];
            var y1 = +locations[1];
            var x2 = +locations[2];
            var y2 = +locations[3];
            var wall = this.wallsActive[key];
            if (wall == null) {
                wall = this.wallsInactive[key];
            }
            if (wall != null) {
                this.svg.removeChild(wall.svg);
                this.wallsInactive[key] = this.wallsActive[key] = null;
            }
            var newWall = new MazeApp.MazeWall(x1, y1, x2, y2, "mz-wall");
            this.wallsInactive[newWall.id] = newWall;
            this.addPath(newWall.path);
            this.svg.appendChild(newWall.svg);
        };
        MazeGraph.prototype.activateAllWalls = function () {
            var wallsInactive = this.wallsInactive;
            for (var key in wallsInactive) {
                if (wallsInactive.hasOwnProperty(key)) {
                    this.activateInactiveWall(this.wallsInactive[key].element);
                }
            }
        };
        MazeGraph.prototype.removePathUsingWallKey = function (wallKey) {
            var pathKey = this.wallsActive[wallKey].crossPath;
            var _a = this.paths[pathKey].mazeNodes, nodeKey1 = _a[0], nodeKey2 = _a[1];
            var index = this.nodes[nodeKey1].siblings.indexOf(nodeKey2);
            if (index > -1) {
                this.nodes[nodeKey1].siblings.splice(index, 1);
            }
            index = this.nodes[nodeKey2].siblings.indexOf(nodeKey1);
            if (index > -1) {
                this.nodes[nodeKey2].siblings.splice(index, 1);
            }
            this.paths[pathKey] = null;
        };
        MazeGraph.prototype.getDirectionsWithDoubleCompressedHex = function (hex, nodeKey1, nodeKey2) {
            var right = MazeApp.Direction.Right;
            var down = MazeApp.Direction.Down;
            var dirs = MazeApp.transformHexToDirection(hex);
            var node1 = this.nodes[nodeKey1];
            var node2 = this.nodes[nodeKey2];
            if (node1 == null || node2 == null) {
                console.log("null node error happened: getDirectionsWithDoubleCompressedHex");
                return null;
            }
            if (dirs[0] === "1") {
                node1.pathDirections.push(right);
            }
            if (dirs[1] === "1") {
                node1.pathDirections.push(down);
            }
            if (dirs[2] === "1") {
                node2.pathDirections.push(right);
            }
            if (dirs[3] === "1") {
                node2.pathDirections.push(down);
            }
            node1.transformDirectionsToSiblingKeys();
            node2.transformDirectionsToSiblingKeys();
            return [node1, node2];
        };
        return MazeGraph;
    }());
    MazeApp.MazeGraph = MazeGraph;
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    var MazeNode = (function () {
        function MazeNode(x, y, spacing) {
            this.discoveredBy = "";
            this.siblings = [];
            this.isVertex = false;
            this.pathDirections = [];
            this.directionsGenerated = false;
            this.spacing = spacing !== null ? spacing : -1;
            this.cx = x;
            this.cy = y;
            this.r = Math.round(this.spacing * .15);
            this.isVisited = false;
            this.isStart = false;
            this.isEnd = false;
            this.key = x + "." + y;
        }
        MazeNode.prototype.setAsStartNode = function (maze) {
            this.isStart = true;
            maze.startKey = this.key;
        };
        MazeNode.prototype.setAsEndNode = function (maze) {
            this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.svg.setAttribute("cx", this.cx.toString());
            this.svg.setAttribute("cy", this.cy.toString());
            this.svg.setAttribute("r", this.r.toString());
            this.svg.setAttribute("class", "mz-node end-node");
            this.isEnd = true;
            maze.endKey = this.key;
            maze.svg.appendChild(this.svg);
        };
        MazeNode.prototype.transformSiblingKeysToDirections = function () {
            if (this.directionsGenerated) {
                return false;
            }
            for (var _i = 0, _a = this.siblings; _i < _a.length; _i++) {
                var sibKey = _a[_i];
                var split = sibKey.split(".");
                var sibX = parseInt(split[0]);
                var sibY = parseInt(split[1]);
                if (sibX !== this.cx) {
                    if (sibX < this.cx) {
                        this.pathDirections.push(MazeApp.Direction.Left);
                    }
                    else {
                        this.pathDirections.push(MazeApp.Direction.Right);
                    }
                }
                else if (sibY !== this.cy) {
                    if (sibY < this.cy) {
                        this.pathDirections.push(MazeApp.Direction.Up);
                    }
                    else {
                        this.pathDirections.push(MazeApp.Direction.Down);
                    }
                }
            }
            this.pathDirections = this.pathDirections.sort();
            return (this.directionsGenerated = true);
        };
        MazeNode.prototype.transformDirectionsToSiblingKeys = function () {
            for (var i = 0; i < this.pathDirections.length; i++) {
                var sibX = this.cx;
                var sibY = this.cy;
                var sibKey = "";
                var nextDirection = this.pathDirections[i];
                switch (nextDirection) {
                    case MazeApp.Direction.Up:
                        sibY -= this.spacing;
                        break;
                    case MazeApp.Direction.Right:
                        sibX += this.spacing;
                        break;
                    case MazeApp.Direction.Down:
                        sibY += this.spacing;
                        break;
                    case MazeApp.Direction.Left:
                        sibX -= this.spacing;
                        break;
                    default:
                        break;
                }
                sibKey += sibX + "." + sibY;
                this.siblings.push(sibKey);
            }
            return this;
        };
        return MazeNode;
    }());
    MazeApp.MazeNode = MazeNode;
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    var MazePath = (function () {
        function MazePath(s1, s2) {
            this.mazeNodes = [];
            var key1 = s1;
            var key2 = s2;
            this.mazeNodes.push(key1);
            this.mazeNodes.push(key2);
            this.style = "mz-path";
            this.id = key1 + "." + key2;
            var splitKeyOne = key1.split(".");
            var splitKeyTwo = key2.split(".");
            var x1 = splitKeyOne[0];
            var y1 = splitKeyOne[1];
            var x2 = splitKeyTwo[0];
            var y2 = splitKeyTwo[1];
            this.crossWall = MazeApp.getOrthogonalKey(+x1, +y1, +x2, +y2);
        }
        return MazePath;
    }());
    MazeApp.MazePath = MazePath;
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    var MazeWall = (function () {
        function MazeWall(x1, y1, x2, y2, css, mazeIndex) {
            this.css = "";
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.id = x1 + "." + y1 + "." + x2 + "." + y2;
            if (mazeIndex != undefined) {
                this.id = this.id + "." + mazeIndex;
            }
            this.length = (x1 === x2) ? Math.round(y2 - y1) : Math.round(x2 - x1);
            this.crossPath = this.getPathKey();
            this.css = css;
            this.isBorder = this.css.match("/border-wall/") ? true : false;
            this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
            this.svg.setAttribute("x1", this.x1.toString());
            this.svg.setAttribute("y1", this.y1.toString());
            this.svg.setAttribute("x2", this.x2.toString());
            this.svg.setAttribute("y2", this.y2.toString());
            this.svg.setAttribute("id", this.id.toString());
            this.svg.setAttribute("class", this.css);
            this.element = this.svg;
            this.path = this.getMazePath();
        }
        MazeWall.prototype.getPathKey = function () {
            var d = Math.round(this.length / 2);
            var pX1;
            var pY1;
            var pX2;
            var pY2;
            if (this.x1 === this.x2) {
                pX1 = this.x1 - d;
                pY1 = this.y1 + d;
                pX2 = this.x1 + d;
                pY2 = this.y1 + d;
            }
            else {
                pX1 = this.x1 + d;
                pY1 = this.y1 - d;
                pX2 = this.x1 + d;
                pY2 = this.y1 + d;
            }
            return pX1 + "." + pY1 + "." + pX2 + "." + pY2;
        };
        MazeWall.prototype.getMazePath = function () {
            if (this.path == null) {
                var pathKey = this.crossPath.split(".");
                var n1 = pathKey[0] + "." + pathKey[1];
                var n2 = pathKey[2] + "." + pathKey[3];
                this.path = new MazeApp.MazePath(n1, n2);
            }
            return this.path;
        };
        return MazeWall;
    }());
    MazeApp.MazeWall = MazeWall;
})(MazeApp || (MazeApp = {}));
var MazeGenerator;
(function (MazeGenerator) {
    var LevelOne = (function () {
        function LevelOne(maze) {
            this.nodes = {};
            this.dataReady = false;
            if (maze != null) {
                this.maze = maze;
                this.nodes = maze.nodes;
                this.prepareLocalDataStore();
            }
        }
        LevelOne.prototype.prepareLocalDataStore = function () {
            if (this.dataReady) {
                return;
            }
            this.wallsToDeactivate = [];
            var keys = Object.keys(this.nodes);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                this.nodes[key].isVisited = false;
                this.nodes[key].discoveredBy = null;
                this.nodes[key].siblings = MazeApp.shuffle(this.nodes[key].siblings);
                if (this.nodes[key].isStart) {
                    this.startNode = this.nodes[key];
                    this.startNode.isVisited = true;
                }
            }
            this.dataReady = true;
        };
        LevelOne.prototype.run = function (maze) {
            if (maze != null) {
                this.dataReady = false;
                delete this.maze;
                delete this.nodes;
                this.maze = maze;
                this.nodes = maze.nodes;
            }
            this.prepareLocalDataStore();
            this.generateMazeWithDfs();
            this.dataReady = false;
            this.maze.activateAllWalls();
            for (var _i = 0, _a = this.wallsToDeactivate; _i < _a.length; _i++) {
                var wall = _a[_i];
                this.maze.deactivateWallUsingWallKey(wall);
            }
        };
        LevelOne.prototype.generateMazeWithDfs = function () {
            var stack = [];
            this.push(stack, this.startNode);
            while (stack.length > 0) {
                var w = this.pop(stack);
                if (w != undefined) {
                    this.visit(w);
                    for (var _i = 0, _a = w.siblings; _i < _a.length; _i++) {
                        var sibKey = _a[_i];
                        var sib = this.nodes[sibKey];
                        if (!sib.isVisited) {
                            sib.discoveredBy = w.key;
                            this.push(stack, sib);
                        }
                    }
                }
            }
        };
        LevelOne.prototype.visit = function (n) {
            if (n !== this.startNode) {
                n.isVisited = true;
                var disc = n.discoveredBy.split(".");
                var wallKey = MazeApp.getOrthogonalKey(+disc[0], +disc[1], +n.cx, +n.cy);
                this.wallsToDeactivate.push(wallKey);
            }
        };
        LevelOne.prototype.push = function (array, node) {
            array.unshift(node);
        };
        LevelOne.prototype.pop = function (array) {
            return array.shift();
        };
        return LevelOne;
    }());
    MazeGenerator.LevelOne = LevelOne;
})(MazeGenerator || (MazeGenerator = {}));
var MazeApp;
(function (MazeApp) {
    var MazeGameController = (function () {
        function MazeGameController(model) {
            var maze;
            var spacing = MazeApp.defaultLineSpacing();
            if (model !== null && model.MazeHash !== null) {
                var bundle = this.parseMazeHash(model.MazeHash);
                maze = new MazeApp.MazeGraph(spacing, bundle, 0);
                var controlZone = new MazeApp.UserControlHandler(maze);
            }
            else {
                maze = new MazeApp.MazeGraph(spacing, null, 1);
                var mazeGenerator = new MazeGenerator.LevelOne(maze).run();
                var compressionHandler = new MazeApp.CompressionHandler(maze);
                var controlZone = new MazeApp.UserControlHandler(maze);
            }
        }
        MazeGameController.prototype.parseMazeHash = function (hash) {
            var hex = "";
            var cols = 0;
            var rows = 0;
            var level = 1;
            var data = hash.split("&");
            for (var i = 0; i < data.length; i++) {
                var dataParts = data[i].split("=");
                var type = dataParts[0], content = dataParts[1];
                if (type === "n") {
                    hex = content;
                }
                else if (type === "c") {
                    cols = +content;
                }
                else if (type === "r") {
                    rows = +content;
                }
                else if (type === "l") {
                    level = +content;
                }
            }
            return {
                hexstring: hex,
                cols: cols,
                rows: rows,
                level: level
            };
        };
        return MazeGameController;
    }());
    MazeApp.MazeGameController = MazeGameController;
})(MazeApp || (MazeApp = {}));
var MazeApp;
(function (MazeApp) {
    var UserControlHandler = (function () {
        function UserControlHandler(maze) {
            this.triggerCoolDown = false;
            this.raceWithNode = true;
            this.keepSpinning = true;
            this.infiniteMode = false;
            this.maze = maze;
            this.setupControlZoneElements();
            this.addUserControlNode();
            this.addAiControlNode();
            this.setupControlZoneBindings();
        }
        UserControlHandler.prototype.setupControlZoneElements = function () {
            $("#racemode > i, #new-maze > i, #level-display ").css({
                "font-size": this.maze.spacing + "px",
            });
            $("#level-display").text("Level " + this.maze.currentLevel);
        };
        UserControlHandler.prototype.setupControlZoneBindings = function () {
            var _this = this;
            $("#new-maze").click(function (e) {
                var currentUrl = window.location.href;
                document.location.href = currentUrl.split("?")[0];
            });
            $(".message-div").on({
                click: function () { _this.nextLevel(); },
                tap: function () { _this.nextLevel(); }
            });
            if (this.raceWithNode) {
                this.raceWithAiNodeBindings();
            }
        };
        UserControlHandler.prototype.nextLevel = function () {
            var url = window.location.href;
            document.location.href = url.split("?")[0] + "?l=" + this.maze.currentLevel;
        };
        UserControlHandler.prototype.addUserControlNode = function () {
            var radius = Math.round(this.maze.spacing * .15);
            var cx = +(this.maze.startKey.split(".")[0]);
            var cy = +(this.maze.startKey.split(".")[1]);
            this.controlNode = new MazeApp.ControlNode({
                cx: cx,
                cy: cy,
                r: radius,
                offset: this.maze.spacing,
                options: null,
                ai: false,
                maze: this.maze
            });
            this.maze.controlNode = this.controlNode;
        };
        UserControlHandler.prototype.addAiControlNode = function () {
            var radius = Math.round(this.maze.spacing * .15);
            var cx = +(this.maze.startKey.split(".")[0]);
            var cy = +(this.maze.startKey.split(".")[1]);
            this.aiNode = new MazeApp.ArtificialIntelligenceNode({
                cx: cx,
                cy: cy,
                r: radius,
                offset: this.maze.spacing,
                options: null,
                ai: true,
                maze: this.maze
            });
            if (this.maze.solutionNodes == null) {
                this.maze.solutionNodes = this.maze.mazeSolver.run();
            }
            this.aiNode.setSolutionNodeKeys(this.maze.solutionNodes);
            this.maze.aiNode = this.aiNode;
            this.aiNode.svgJq.velocity({ opacity: 0 }, { duration: 0 });
        };
        UserControlHandler.prototype.raceWithAiNodeBindings = function () {
            var _this = this;
            $("#racemode").click(function (e) {
                if (+_this.aiNode.svgJq.css("opacity") === 0) {
                    $("#level-display").addClass("blue");
                    $(".fa-retweet, .racemode-label").addClass("magenta").removeClass("grey");
                    _this.controlNode.coolDown = false;
                    _this.aiNode.keepRacing = true;
                    MazeApp.setTimingMarks(_this.maze);
                    _this.aiNode.kickOffRace();
                }
                else {
                    _this.aiNode.keepRacing = false;
                    $(".fa-retweet, .racemode-label").addClass("grey").removeClass("magenta");
                    $("#level-display").removeClass("blue");
                    _this.aiNode.goHome(false);
                }
            });
        };
        return UserControlHandler;
    }());
    MazeApp.UserControlHandler = UserControlHandler;
})(MazeApp || (MazeApp = {}));
//# sourceMappingURL=App.js.map