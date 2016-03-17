import React from 'react';
import $ from 'jquery';

import PureRenderComponent from './pure_render';

import '../../style/components/board.styl';

export default class Board extends PureRenderComponent {
    render = () =>
        <div className="board-component" onMouseOver={this.highlight}>
            <div className="grid">
                {_(19).range().map(i =>
                    <div
                     className="horizontal line"
                     onMouseOver={this.highlight}
                     style={{
                         top: `${i * (50 / 9) - (50 / 9 / 2)}%`,
                         padding: `${50 / 9 / 2}% 0`,
                     }}>
                        <div className="inner"></div>
                        <div className="label" onMouseOver={this.highlight}>
                            {i + 1}
                        </div>
                    </div>
                ).value()}
                {_(19).range().map(i =>
                    <div
                     className="vertical line"
                     onMouseOver={this.highlight}
                     style={{
                         left: `${i * (50 / 9) - (50 / 9 / 2)}%`,
                         padding: `0 ${50 / 9 / 2}%`,
                     }}>
                        <div className="inner"></div>
                        <div className="label" onMouseOver={this.highlight}>
                            {String.fromCharCode(65 + i)}
                        </div>
                    </div>
                ).value()}
            </div>
        </div>

    highlight = e => {
        var $el = $(e.target);
        var $highlighted;

        switch(e.target.className) {
            case 'horizontal line':
            case 'vertical line':
                $highlighted = $el.addClass('highlighted');
                break;
            case 'label':
                $highlighted = $el.parent().addClass('highlighted');
                break;
            case 'board-component':
                $el.find('.grid').children().removeClass('highlighted');
                break;
        }

        if ($highlighted) {
            var direction = $highlighted.hasClass('horizontal') ? 'horizontal' : 'vertical';
            $highlighted.siblings(`.${direction}`).removeClass('highlighted');
        }
    }
}
