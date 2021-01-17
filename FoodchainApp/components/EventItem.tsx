import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Headline } from 'react-native-paper';
import FoodsectionModel from '../models/foodsection.model';

export interface EventItemProps {
    section: FoodsectionModel;
}

const EventItem: React.FC<EventItemProps> = (props) => {
    return(
        <View style={styles.container}>
            <Card style={styles.card} >
                <View style={styles.content}>
                    <Card.Content style={{width: '70%'}}>
                        <Headline style={styles.title}>{props.section.title}</Headline>
                        <Card.Content style={styles.footer}>
                            <Paragraph style={styles.time}>{props.section.begin}</Paragraph>
                            <Paragraph style={styles.time}>to</Paragraph>
                            <Paragraph style={styles.time}>{props.section.end}</Paragraph>
                        </Card.Content>
                    </Card.Content>
                    <Card.Cover style={styles.image} source={{ uri: props.section.url }} />
                </View>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemContainer: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: "#141414",
        borderWidth: 1,
        borderBottomColor: 'gray'
    },
    content: {
        flexDirection: 'row',
        marginTop: 10,
        marginRight: 10
    },
    image: {
        resizeMode: 'contain',
        width: '30%',
        height: 150
    },
    source: {
        fontSize: 10,
        lineHeight: 10,
        color: "#C1C1C1"
    },
    title: {
        fontSize: 14,
        lineHeight: 14,
        color: "#FFFFFF"
    },
    tags: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    tag: {
        borderRadius: 100,
        backgroundColor: "#424242",
        alignContent: "center",
        justifyContent: "center",
        fontSize: 8,
        color: '#FFFFFF',
        paddingHorizontal: 6,
        paddingVertical: 3,
        marginRight: 6,
        marginTop: 3
    },
    time: {
        // fontFamily: "Noto Sans",
        fontSize: 10,
        color: "#828282",
    },
    footer: {
        // marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
});

export default EventItem;