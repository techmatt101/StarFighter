var scoreboardElement;
var Leaderboard = {
    showScores: function() {
        Leaderboard.getScores(function(response) {
            console.log(response);
            Leaderboard.renderScores(response.scores);
            scoreboardElement.hidden = false;
        });
    },

    getScores: function(callback) {
        JSONP.get('http://localhost:3000/leaderboards/123/scores', {}, callback);
    },

    submitScore: function(score, callback) {
        JSONP.get('http://localhost:3000/leaderboards/123/players/1/submit', { score: score }, callback);
    },

    renderScores: function(scores) {
        var html = '';
        var length = Math.min(scores.length, 5);
        for (var i = 0; i < length; i++) {
            var score = scores[i];
            html += '<li>' + score.value + '</li>';
        }
        scoreboardElement.innerHTML = html;
    }
};