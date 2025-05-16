import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';

import { ServicePointModal } from '../Dialogs/ServicePointModal';
import { InputComponent } from '../InputComponent';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { MyButton } from '../Ui/MyButton';
import { MyText } from '../Ui/MyText';
import { UserPreview } from '../Ui/UserPreview';
import VStack from '../Ui/VStack';

import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useSelect } from '~/hooks/useSelect';

export const ServicePointForm = () => {
  const { onDeselect, user, onSelect } = useSelect();
  const { editId } = useLocalSearchParams<{ editId: Id<'servicePoints'> }>();

  const [fetching, setFetching] = useState(false);
  const { id } = useLocalSearchParams<{ id: Id<'organizations'> }>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const createServicePoint = useMutation(api.servicePoints.createServicePoint);
  const updateServicePoint = useMutation(api.servicePoints.updateServicePoint);
  const servicePoint = useQuery(
    api.servicePoints.getSingleServicePointAndWorker,
    {
      servicePointId: editId,
    }
  );
  useEffect(() => {
    if (!editId || !servicePoint) return;
    const fetchServicePoint = async () => {
      setFetching(true);
      try {
        if (servicePoint) {
          onSelect({
            id: servicePoint.staff,
            name: servicePoint?.worker?.name!,
            role: servicePoint?.worker?.role!,
            image: servicePoint.worker?.imageUrl!,
          });
          setValues({
            name: servicePoint.name,
            description: servicePoint.description!,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong', {
          description: 'Failed to fetch service point. Please try again',
        });
      } finally {
        setFetching(false);
      }
    };
    fetchServicePoint();
  }, [editId, servicePoint, onSelect]);
  const onClose = useCallback(() => setIsOpen(false), []);

  const [values, setValues] = useState({
    name: '',
    description: '',
  });
  const handleChange = (name: string, value: string) => {
    setValues({
      ...values,
      [name]: value,
    });
  };
  const onChangeStaff = async () => {
    setLoading(true);
    if (!user) return;
    try {
      await updateServicePoint({
        servicePointId: editId,
        workerId: user.id,
        name: values.name,
        description: values.description,
      });
      toast.success('Edited successfully');
      router.back();
      onDeselect();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong', {
        description: 'Failed to edit. Please try again',
      });
    } finally {
      setLoading(false);
    }
  };
  const onCreateServicePoint = async () => {
    setLoading(true);
    if (!user?.id) return;
    try {
      await createServicePoint({
        name: values.name,
        description: values.description,
        organisationId: id,
        workerId: user.id,
      });

      toast.success('Success', {
        description: 'Service point created successfully',
      });
      setIsOpen(true);
      setValues({ name: '', description: '' });
      onDeselect();
      router.back();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong', {
        description: 'Failed to create service point. Please try again',
      });
    } finally {
      setLoading(false);
    }
  };
  const onAddServicePoint = async () => {
    if (editId) {
      await onChangeStaff();
    } else {
      await onCreateServicePoint();
    }
  };
  if (fetching) return <LoadingComponent />;
  const isDisabled = !values.name || !values.description || !user || loading;
  const isDisabled2 = !user || loading;
  return (
    <VStack flex={1}>
      <ServicePointModal
        text="Service Point Created"
        isOpen={isOpen}
        onClose={onClose}
      />

      <>
        <InputComponent
          label="Quick point name"
          value={values.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Eg. customers service"
        />

        <InputComponent
          label="Description"
          value={values.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Describe what this service point is for"
          multiline
          textarea
        />
      </>

      {user ? (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            borderColor: colors.gray10,
            marginHorizontal: 10,
          }}
        >
          <UserPreview
            onPress={() => router.push('/select-staff')}
            name={user.name}
            imageUrl={user.image}
            roleText={user.role}
          />
        </View>
      ) : (
        <Pressable
          onPress={() => router.push('/select-staff')}
          style={({ pressed }) => [styles.select, pressed && { opacity: 0.5 }]}
        >
          <MyText poppins="Bold" fontSize={15} style={{ color: '#929292' }}>
            Select staff
          </MyText>
        </Pressable>
      )}
      <MyButton
        onPress={onAddServicePoint}
        disabled={editId ? isDisabled2 : isDisabled}
        containerStyle={{ marginHorizontal: 10, marginTop: 20 }}
        buttonStyle={{ height: 55, width: '100%' }}
        loading={loading}
      >
        <MyText poppins="Bold" fontSize={15} style={{ color: 'white' }}>
          Proceed
        </MyText>
      </MyButton>
    </VStack>
  );
};

const styles = StyleSheet.create({
  select: {
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
});
