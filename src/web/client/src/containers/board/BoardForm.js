import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getParking } from '../../modules/board';
import BoardTable from '../../components/board/BoardTable';
import socketio from 'socket.io-client';

const socket = socketio.connect('http://192.9.44.170:65002/');

const BoardForm = () => {
  const dispatch = useDispatch();
  const { parking } = useSelector(({ board }) => ({
    parking: board.parking,
  }));

  socket.on('parking-data', () => {
    dispatch(getParking());
  });

  useEffect(() => {
    dispatch(getParking());
  }, [dispatch]);

  return <BoardTable parking={parking} />;
};

export default BoardForm;
