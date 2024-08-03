import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';

type ItemProps = { id: number, name: string, party: string, acronym: string, photo: any, src: any, selected?: any, setSelected: any, xTexts: any, setXtexts: any, isFactor: boolean, navigation: any };

export function CandidateItem({ id, name, party, acronym, photo, src, setSelected, xTexts, setXtexts, isFactor, navigation }: ItemProps) {
    
    const onPress = () => {
        setSelected(id);
        setXtexts((prevState: any) => {
            const newState = [...prevState].fill("");
            newState[id] = "X";
            return newState;
        });
    }

    useEffect(() => {
        if (isFactor) {
            onPress();
        }
    }, []);

    const onPressName = () => {
        if (xTexts[id] === "X") {
            navigation.navigate('TwoFactor',
                { id, name, party, photo, src }
            );
        }
    }

    const onOpenDetails = () => {
        navigation.navigate('Candidate Details',
            { id, name, party, acronym, photo, src }
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                start={{ x: 0.1, y: 0.2 }}
                end={{ x: 0.9, y: 0.6 }}
                locations={[0.2, 0.1, 1]}
                colors={['#ddce71', '#EAD972', '#F56F6F']}
                style={styles.background}
            />
            <View style={styles.item}>
                <View style={styles.halfMoon} />

                <View style={styles.candidateContainer}>
                    <View style={styles.containerLeftImage}>
                        <TouchableOpacity disabled={isFactor} onPress={onOpenDetails}>
                            <Image source={photo ? { uri: photo} : null} style={{ borderRadius: 40,  resizeMode: 'contain', width: 65, height: 70 }}/>

                            <View style={styles.badge}>
                                <Image source={src ? { uri: src} : null}  style={{ resizeMode: 'contain', width: 30, height: 30 }}></Image>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.candidateLeftText}>
                        <Text style={styles.textName} onPress={onPressName}>{name}</Text>
                        <View style={styles.candidateBottom}>
                            <Text style={styles.textParty}>{acronym}</Text>
                            <Text style={styles.textNumber}>#{id}</Text>
                        </View>
                    </View>
                    <View style={styles.voteCheckContainer}>
                        <TouchableOpacity disabled={isFactor} style={styles.button} onPress={onPress}>
                            <Text style={styles.textChecked}>{xTexts[id]}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'transparent',
        height: 100,
        marginBottom: 10,
        maxHeight: 100
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        borderRadius: 10
    },
    item: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingLeft: 0,
        width: '100%',
        marginVertical: 8,
        marginHorizontal: 0,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center'
    },
    halfMoon: {
        justifyContent: 'flex-start',
        backgroundColor: '#ee6060',
        width: 50,
        height: '85%',
        alignContent: 'center',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        paddingLeft: 0,
        left: -38,
        position: 'absolute'
    }, candidateContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 12,
        height: '80%'
    }, candidateLeftText: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 5,
        gap: 5
    }, textName: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        paddingTop: 5
    }, textParty: {
        color: '#ffffffa8',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center'
    }, candidateBottom: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingRight: 10,
        width: '100%'
    }, textNumber: {
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        color: '#ffffffa8',
        fontSize: 18,
        fontWeight: '700'
    }, voteCheckContainer: {
        backgroundColor: '#ffffff42',
        borderRadius: 20,
        width: 85,
        height: '95%',
        justifyContent: 'center',
        alignSelf: 'center'
    }, button: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10,
    }, textChecked: {
        fontFamily: 'rubickglitch-regular',
        fontSize: 40,
        color: 'white',
        fontWeight: '500'
    }, badge: {
        borderRadius: 40,
        resizeMode: 'contain',
        maxWidth: 40,
        maxHeight: 40,
        backgroundColor: 'transparent',
        bottom: -5,
        right: 0,
        position: 'absolute'
    }, containerLeftImage: {
        flexDirection: 'row',
    }
});