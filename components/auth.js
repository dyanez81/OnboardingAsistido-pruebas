import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Auth(){

    const [isLogin, setIsLogin] = useState(true);
    

    return (
        <View style={styles.view}>
            <Text>Auth...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
    },
    logo:{
        width: '80%',
        height: 240,
        marginTop:50,
        marginBottom: 50,
    },
})

