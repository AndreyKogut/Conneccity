eventProfile.factory('getEventInfo', ['$http', function ($http) {
  return {
    get: function (id) {
      return $http({
        url: GOOGLE_IP + "events/" + id,
        method: "GET"
      });
    },
    getMembers: function (id) {
      return $http({
        url: GOOGLE_IP + "events/" + id + "/members",
        method: "GET"
      });
    },
    join: function (id) {
      return $http({
        url: GOOGLE_IP + "events/" + id + "/members",
        method: "POST"
      });
    },
    leave: function (id) {
      return $http({
        url: GOOGLE_IP + "events/" + id + "/members",
        method: "DELETE"
      })
    },
    sendMessage: function (id) {
    return $http({
      url: GOOGLE_IP + "events/" + id + "/chat",
      method: "GET"
    });
  }
  };
}]);