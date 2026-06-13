/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('DashboardTodoCtrl', DashboardTodoCtrl);

  /** @ngInject */
  function DashboardTodoCtrl($scope, $timeout, $window, baConfig) {

    $scope.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;
    var colors = [];
    for (var key in dashboardColors) {
      colors.push(dashboardColors[key]);
    }

    function getRandomColor() {
      var i = Math.floor(Math.random() * colors.length);
      return colors[i];
    }

    var STORAGE_KEY = 'blurAdmin.todoList';
    var INPUT_MAX_LEN = 200;

    // --- Seed data (used on first visit) ---
    function createSeedData() {
      var items = [
        { text: 'Check me out' },
        { text: 'Lorem ipsum dolor sit amet, possit denique oportere at his, etiam corpora deseruisse te pro' },
        { text: 'Ex has semper alterum, expetenda dignissim' },
        { text: 'Vim an eius ocurreret abhorreant, id nam aeque persius ornatus.' },
        { text: 'Simul erroribus ad usu' },
        { text: 'Ei cum solet appareat, ex est graeci mediocritatem' },
        { text: 'Get in touch with akveo team' },
        { text: 'Write email to business cat' },
        { text: 'Have fun with blur admin' },
        { text: 'What do you think?' },
      ];
      var base = Date.now();
      items.forEach(function (item, idx) {
        item.id = base + idx + Math.random();
        item.checked = false;
        item.color = getRandomColor();
      });
      return items;
    }

    // --- Persistence ---
    function loadFromStorage() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        // corrupted data — fall through to seed
      }
      return createSeedData();
    }

    var saveTimer;
    function saveToStorage() {
      if (saveTimer) $timeout.cancel(saveTimer);
      saveTimer = $timeout(function () {
        saveTimer = null;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify($scope.todoList));
        } catch (e) { /* storage full or disabled */ }
      }, 300);
    }

    // Flush any pending debounced save immediately
    function flushSave() {
      if (saveTimer) {
        $timeout.cancel(saveTimer);
        saveTimer = null;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify($scope.todoList));
        } catch (e) { /* storage full or disabled */ }
      }
    }

    // --- Init ---
    $scope.todoList = loadFromStorage();
    $scope.filter = 'all';
    $scope.newTodoText = '';
    $scope.inputMaxLen = INPUT_MAX_LEN;

    // --- Filter ---
    $scope.isVisible = function (item) {
      if ($scope.filter === 'active') return !item.checked;
      if ($scope.filter === 'completed') return !!item.checked;
      return true;
    };

    $scope.visibleCount = function () {
      var count = 0;
      $scope.todoList.forEach(function (item) {
        if ($scope.isVisible(item)) count++;
      });
      return count;
    };

    $scope.activeCount = function () {
      var count = 0;
      $scope.todoList.forEach(function (item) { if (!item.checked) count++; });
      return count;
    };

    $scope.completedCount = function () {
      return $scope.todoList.length - $scope.activeCount();
    };

    $scope.progressPercent = function () {
      if ($scope.todoList.length === 0) return 0;
      return Math.round($scope.completedCount() / $scope.todoList.length * 100);
    };

    // --- Actions ---
    $scope.addToDoItem = function (event, clickPlus) {
      if (clickPlus || event.which === 13) {
        var text = ($scope.newTodoText || '').trim();
        if (!text || text.length > INPUT_MAX_LEN) return;
        $scope.todoList.unshift({
          id: Date.now() + Math.random(),
          text: text,
          checked: false,
          color: getRandomColor(),
        });
        $scope.newTodoText = '';
      }
    };

    $scope.deleteItem = function (item) {
      var idx = $scope.todoList.indexOf(item);
      if (idx > -1) $scope.todoList.splice(idx, 1);
    };

    $scope.clearCompleted = function () {
      $scope.todoList = $scope.todoList.filter(function (item) {
        return !item.checked;
      });
      // Return to full view so the user isn't staring at an empty filter
      $scope.filter = 'all';
    };

    // --- Watch for changes and persist ---
    $scope.$watch('todoList', function () {
      saveToStorage();
    }, true);

    // Flush pending save when navigating away inside the SPA
    $scope.$on('$destroy', function () {
      flushSave();
      angular.element($window).off('beforeunload', flushSave);
    });

    // Flush pending save when closing or refreshing the page
    angular.element($window).on('beforeunload', flushSave);
  }
})();
