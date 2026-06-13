/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardTodoCtrl', DashboardTodoCtrl);

  /** @ngInject */
  function DashboardTodoCtrl($scope, baConfig) {
    var STORAGE_KEY = 'blur-admin-todo-list';

    $scope.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;
    var colors = [];
    for (var key in dashboardColors) {
      colors.push(dashboardColors[key]);
    }

    function getRandomColor() {
      var i = Math.floor(Math.random() * (colors.length - 1));
      return colors[i];
    }

    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // --- Persistence ---
    function saveTodoList() {
      var data = $scope.todoList.map(function (item) {
        return { id: item.id, text: item.text, done: item.done, color: item.color };
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        // localStorage unavailable, operate in-memory only
      }
    }

    function loadTodoList() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach(function (item) {
              if (!item.id) item.id = generateId();
              if (!item.color) item.color = getRandomColor();
              if (typeof item.done !== 'boolean') item.done = false;
            });
            return parsed;
          }
        }
      } catch (e) {
        // corrupted data, fall through to defaults
      }
      return null;
    }

    // --- Init ---
    var saved = loadTodoList();
    if (saved !== null) {
      $scope.todoList = saved;
    } else {
      $scope.todoList = [
        { text: 'Check me out' },
        { text: 'Get in touch with akveo team' },
        { text: 'Write email to business cat' },
        { text: 'Have fun with blur admin' },
        { text: 'What do you think?' },
      ];
      $scope.todoList.forEach(function (item) {
        item.id = generateId();
        item.color = getRandomColor();
        item.done = false;
      });
      saveTodoList();
    }

    // --- Filter ---
    $scope.activeFilter = 'all';

    $scope.setFilter = function (filter) {
      $scope.activeFilter = filter;
    };

    $scope.shouldShowItem = function (item) {
      if ($scope.activeFilter === 'active') return !item.done;
      if ($scope.activeFilter === 'completed') return item.done;
      return true;
    };

    $scope.remainingCount = function () {
      var count = 0;
      for (var i = 0; i < $scope.todoList.length; i++) {
        if (!$scope.todoList[i].done) count++;
      }
      return count;
    };

    $scope.visibleCount = function () {
      var count = 0;
      for (var i = 0; i < $scope.todoList.length; i++) {
        if ($scope.shouldShowItem($scope.todoList[i])) count++;
      }
      return count;
    };

    // --- Sortable ---
    $scope.sortableOptions = {
      items: 'li:not(.ng-hide)',
      tolerance: 'pointer',
      stop: function () {
        saveTodoList();
      }
    };

    // --- Actions ---
    $scope.newTodoText = '';

    $scope.addToDoItem = function (event, clickPlus) {
      if (clickPlus || event.which === 13) {
        var text = ($scope.newTodoText || '').trim();
        if (!text) {
          $scope.newTodoText = '';
          return;
        }
        $scope.todoList.unshift({
          id: generateId(),
          text: text,
          color: getRandomColor(),
          done: false,
        });
        $scope.newTodoText = '';
        saveTodoList();
      }
    };

    $scope.onItemChanged = function () {
      saveTodoList();
    };

    $scope.removeTodoItem = function (item) {
      var index = $scope.todoList.indexOf(item);
      if (index > -1) {
        $scope.todoList.splice(index, 1);
        saveTodoList();
      }
    };
  }
})();
