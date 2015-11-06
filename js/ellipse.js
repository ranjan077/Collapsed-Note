angular.module('ellipsis', [])
 .directive('ellipsis', function() {

        return {
            restrict: 'A',
            scope: {
                note: '=',
                ellipsisExpandText: '@',
                ellipsisCollapseText: '@',
                ellipsisSymbol: '@'
            },
            compile: function(elem, attr, linker) {

                return (function(scope, element, attributes) {
                    var truncatedElementContent = '';
                    var ellipsisSymbol = typeof (attributes.ellipsisSymbol) !== 'undefined' ?
                        attributes.ellipsisSymbol : '&hellip;';
                    var appendExpandString = (typeof (scope.ellipsisExpandText) !== 'undefined' &&
                    scope.ellipsisExpandText !== '') ? '<span class=\'alert-danger\' ' +
                    'ng-click=\'showFullText()\'>' + ellipsisSymbol + scope.ellipsisExpandText +
                    '</span>' : ellipsisSymbol;
                    var appendCollapseString = (typeof (scope.ellipsisCollapseText) !== 'undefined' &&
                    scope.ellipsisCollapseText !== '') ? '<span class=\'alert-danger\' ng-click=' +
                    '\'showLessText()\'>'
                    + ellipsisSymbol + scope.ellipsisCollapseText + '</span>' : ellipsisSymbol;


                    function showFullText(element) {
                        var binding = scope.note;

                        element.text(binding).html(element.html() + appendCollapseString);
                        element.removeClass('scroll-hidden');
                        element.css({ 'overflow': 'inherit' });
                        element.find('span').bind('click', function(e) {
                            showLessText(element);
                        });
                    }

                    function showLessText(element) {
                        truncatedElementContent.length > 0 ? appendContent() : buildEllipsis();

                        function appendContent() {
                            element.addClass('scroll-hidden');
                            element.text(truncatedElementContent).html(element.html() + appendExpandString);
                            element.find('span').bind('click', function(e) {
                                showFullText(element);
                            });
                        }
                    }

                    function buildEllipsis() {
                        var binding = scope.note;
                        var isTrustedHTML = false;

                        if (binding) {

                            var i = 0;
                            element.text(binding);

                            // If text has overflow
                            if (isOverflowed(element)) {
                                var bindingLength = binding.length, midPoint, beforeData = binding, afterData;
                                    
                                do {
                                    midPoint = Math.round(beforeData.length/2);
                                    beforeData = beforeData.slice(0, midPoint);
                                    afterData = binding.slice(midPoint);
                                    element.text(beforeData).html(element.html());
                                } while(isOverflowed(element));
                                for (;i < afterData.length; i++) {
                                    beforeData = beforeData.concat(afterData[i]);
                                    element.text(beforeData).html(element.html());
                                    if (isOverflowed(element) == true) {
                                        beforeData = beforeData.slice(0, beforeData.length-1);
                                        element.text(beforeData).html(element.html());
                                        break;
                                    }
                                }

                                var appendText = ellipsisSymbol+scope.ellipsisExpandText;
                                beforeData = beforeData.slice(0, ((beforeData.length-1) - appendText.length));
                                element.text(beforeData).html(element.html() + appendExpandString);
                               
                                element.find('span').bind('click', function(e) {
                                    showFullText(element);
                                });

                            }
                        }
                    }

                    // Test if element has overflow of text beyond height or max-height
                     
                    function isOverflowed(thisElement) {
                        thisElement = thisElement;
                        return thisElement[0].scrollHeight > thisElement[0].clientHeight;
                    }

                    function init() {
                        buildEllipsis();
                    }

                    init();
                })
            }
        };
    })