import { CaretLeft, UsersFour, WarningCircle } from 'phosphor-react-native'
import logoImg from '@assets/flag.png';
import profileImg from '@assets/alfredo_party_60.png';
import theme from 'src/theme';
import { Image, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ItemProps = {title: string, timestamp: string, people: string, src: Image};

export function NewsItem({title, timestamp, people, src}: ItemProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                start={{x: 0.1, y:0.2}}
                end={{x: 0.9, y: 0.6}}
                locations={[0.2, 0.1, 1]}
                colors={['#ddce71', '#EAD972', '#F56F6F']}
                style={styles.background}
            />
            <View style={styles.item}>
                <View style={styles.halfMoon}/>

                <View style={styles.imageView}>
                    <Image source={src} style={{width: '100%', height: '100%', borderRadius: 10, resizeMode: 'cover'}} />
                </View>

                <View style={styles.rightContainer}>
                    <View style={styles.topTitleContainer}>
                        <Text style={{ color: theme.COLORS.WHITE, fontWeight: 'bold' }}>{title}</Text>
                    </View>

                    <View style={styles.bottomContainer}>
                        <Text style={{ marginRight: 20, color: theme.COLORS.WHITE }}>{timestamp}</Text>

                        <View>
                            <UsersFour size={16} color={theme.COLORS.WHITE} />
                        </View>
                        <Text style={{color: theme.COLORS.WHITE}}>{people}</Text>
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
        backgroundColor: '#fff',
        height: 100,
        marginBottom: 10
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
    },
    imageView: {
        width: 100,
        maxWidth: 60,
        marginLeft: 20,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignSelf: 'center',
        alignItems: 'center',
        flex: 1,
        height: '90%',
        flexDirection: 'row',
        borderRadius: 10
    },
    rightContainer: {
        paddingLeft: 5,
        flex: 1,
        gap: 5,
        paddingRight: 10
    },
    topTitleContainer: {
        justifyContent: 'flex-start'
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 5,
        gap: 5
    }
});