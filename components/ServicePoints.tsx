import BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { EmptyText } from './EmptyText';
import { HStack } from './HStack';
import { ServicePointAction } from './ServicePointAction';
import { MyText } from './Ui/MyText';
import VStack from './Ui/VStack';

import { DeleteBottomSheet } from '~/components/Ui/DeleteBottomSheet';
import { ServicePointType } from '~/constants/types';
import { Id } from '~/convex/_generated/dataModel';

type Props = {
  data: ServicePointType[];
};

export const ServicePoints = ({ data }: Props) => {
  const ref = useRef<BottomSheet>(null);
  const [id, setId] = useState<Id<'servicePoints'> | null>(null);
  const onOpenBottomSheet = () => {
    ref?.current?.expand();
  };
  const onCloseBottomSheet = useCallback(() => {
    ref.current?.close();
  }, []);
  const onGetId = useCallback((id: Id<'servicePoints'>) => {
    setId(id);
    onOpenBottomSheet();
  }, []);
  return (
    <>
      <FlatList
        style={{ marginTop: 20 }}
        data={data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ServicePointItem item={item} onGetId={onGetId} />}
        ListEmptyComponent={() => <EmptyText text="No service point yet" />}
      />
      <DeleteBottomSheet id={id!} ref={ref} onClose={onCloseBottomSheet} />
    </>
  );
};

const ServicePointItem = ({
  item,
  onGetId,
}: {
  item: ServicePointType;
  onGetId: (id: Id<'servicePoints'>) => void;
}) => {
  const [visible, setVisible] = useState(false);

  const onOpen = () => setVisible(true);
  const onClose = () => setVisible(false);

  const onShowDeleteModal = () => {
    onClose();
    onGetId(item._id);
  };

  const handleEdit = () => {
    onClose();
    router.push(`/create-service?editId=${item._id}`);
  };

  return (
    <>
      <HStack justifyContent="space-between">
        <VStack flex={1}>
          <MyText poppins="Bold" fontSize={18}>
            {item.name}
          </MyText>
          <MyText poppins="Medium" fontSize={14}>
            {item.description}
          </MyText>
        </VStack>
        <ServicePointAction
          visible={visible}
          onClose={onClose}
          onOpen={onOpen}
          handleDelete={onShowDeleteModal}
          handleEdit={handleEdit}
        />
      </HStack>
    </>
  );
};
