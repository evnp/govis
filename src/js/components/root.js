import React from 'react';

import PureRenderComponent from './pure_render';
import Connectors from './connectors';
import Board from './board';
import Text from './text';

import '../../style/components/root.styl';

export default class Root extends PureRenderComponent {
    render = () =>
        <div className="root-component">
            <Connectors {...this.props} />
            <div className="left">
                <Board {...this.props} />
            </div>
            <div className="right">
                <Text {...this.props} />
            </div>
        </div>
}
