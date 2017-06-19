/// <reference path="../../typings/globals/jquery/index.d.ts" />
var MazeApp;
(function (MazeApp) {
    var Dashboard = (function () {
        function Dashboard(model) {
            this.tableBody = model.tableBody;
            this.buildTheTable(model.data);
            console.log(model.data);
        }
        Dashboard.prototype.buildTheTable = function (data) {
            for (var i = 0; i < data.length; i++) {
                var row = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                var td3 = document.createElement("td");
                td1.innerText = this.parseDate(data[i].RaceDate);
                td2.innerText = data[i].CompletionTime;
                td3.innerText = data[i].MazeId;
                row.appendChild(td1);
                row.appendChild(td2);
                row.appendChild(td3);
                this.tableBody.append($(row));
            }
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
//# sourceMappingURL=Dashboard.js.map