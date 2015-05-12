var scoreboardElement;
var loginBtn;
var signedIn = false;
var userId = '';
var leaderboardId = '5551aedcb43ac7697b9a4894';

window.addEventListener('load', function() {
    loginBtn = document.getElementById('login');
    scoreboardElement = document.getElementById('scores');
    scoreboardElement.hidden = true;

    var tokenData = {};
    JSONP.get('http://localhost:3000/users/tokens/generate', {}, function(data) {
        tokenData = data.response;
    });

    loginBtn.addEventListener('click', function() {
        if(signedIn) return;
        loginPopup(tokenData.url, function() {
            JSONP.get('http://localhost:3000/users/tokens/' + tokenData.token, {}, function(data) {
                if (data.success && data.response.success) {
                    userId = data.response.user_id; //TODO: store in local storage
                    JSONP.get('http://localhost:3000/users/' + userId, { }, function(data) {
                        signedIn = true;
                        loginBtn.textContent = 'Hello ' + data.response.username;
                    });
                }
            });
        });
    });
});

var Leaderboard = {
    showScores: function() {
        Leaderboard.getScores(function(data) {
            if (data.success) {
                Leaderboard.renderScores(data.response.scores);
                scoreboardElement.hidden = false;
            } else {
                scoreboardElement.hidden = true;
            }
        });
    },

    hide: function() {
        scoreboardElement.hidden = true;
    },

    updateScore: function(score, callback) {
        Leaderboard.submitScore(score, function() {
            callback();
        });
    },

    getScores: function(callback) {
        JSONP.get('http://the-game-grid.com:3002/leaderboards/' + leaderboardId + '/scores', {}, callback);
    },

    submitScore: function(score, callback) {
        if(!userId) return callback();
        JSONP.get('http://the-game-grid.com:3002/leaderboards/' + leaderboardId + '/players/' + userId + '/submit', { score: score }, callback);
    },

    renderScores: function(scores) {
        var html = '';
        var length = Math.min(scores.length, 10);
        for (var i = 0; i < length; i++) {
            var score = scores[i];
            html += '<li>' + score.position + '. ' + score.username + ' <span class="score">' + score.score + '</span></li>';
        }
        scoreboardElement.innerHTML = html;
    }
};

function loginPopup(url, callback) {
    var childWindow = popupCenter(url, 'The GRID Login', 480, 560);
    var interval = setInterval(function() {
        if (childWindow.closed) {
            clearInterval(interval);
            callback();
        }
    }, 500);
}

function popupCenter(url, title, width, height) {
    // Fixes dual-screen position
    var dualScreenLeft = (typeof window.screenLeft !== 'undefined') ? window.screenLeft : screen.left,
        dualScreenTop = (typeof window.screenTop !== 'undefined') ? window.screenTop : screen.top,
        viewportWidth = (window.innerWidth) ? window.innerWidth : (document.documentElement.clientWidth) ? document.documentElement.clientWidth : screen.width,
        viewPortHeight = (window.innerHeight) ? window.innerHeight : (document.documentElement.clientHeight) ? document.documentElement.clientHeight : screen.height;

    var left = ((viewportWidth / 2) - (width / 2)) + dualScreenLeft,
        top = ((viewPortHeight / 2) - (height / 2)) + dualScreenTop;

    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }

    return newWindow;
}